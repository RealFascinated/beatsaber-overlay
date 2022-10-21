import { Link, Spinner } from "@nextui-org/react";
import { NextSeo } from "next-seo";
import { Component } from "react";
import PlayerStats from "../src/components/PlayerStats";
import ScoreStats from "../src/components/ScoreStats";
import SongInfo from "../src/components/SongInfo";
import LeaderboardType from "../src/consts/LeaderboardType";
import Utils from "../src/utils/utils";

import styles from "../styles/overlay.module.css";

export default class Overlay extends Component {
	#_beatSaverURL = "";

	constructor(props) {
		super(props);

		this._mounted = false;
		this.state = {
			hasError: false,

			loadingPlayerData: true,
			isConnectedToSocket: false,
			id: undefined,
			isValidSteamId: false,
			websiteType: "ScoreSaber",
			data: undefined,
			showPlayerStats: true,
			showScore: false,
			showSongInfo: false,
			loadedDuringSong: false,

			socket: undefined,
			isVisible: false,
			songInfo: undefined,
			beatSaverData: undefined,
			currentSongTime: 0,
			paused: true,
			currentScore: 0,
			percentage: "100.00%",
			failed: false,
			mapStarCount: undefined,
			SaberA: {
				averageCut: [15.0],
				averagePreSwing: [70.0],
				averagePostSwing: [30.0],
			},
			SaberB: {
				averageCut: [15.0],
				averagePreSwing: [70.0],
				averagePostSwing: [30.0],
			},
		};
		this.setupTimer();
	}

	async componentDidMount() {
		if (this._mounted === true) {
			return;
		}
		this._mounted = true;

		if (this.state.hasError) {
			// Reload the page if there has been an error
			console.log("There has been an error and the page was reloaded.");
			return Router.reload(window.location.pathname);
		}

		console.log("Initializing...");
		this.#_beatSaverURL =
			document.location.origin + "/api/beatsaver/map?hash=%s";
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());

		// Check what website the player wants to use
		if (params.beatleader === "true" || params.beatLeader === "true") {
			this.setState({ websiteType: "BeatLeader" });
		}

		const id = params.id;
		if (!id) {
			// Check if the id param is valid
			this.setState({ isValidSteamId: false, loadingPlayerData: false });
			return;
		}

		// Checks if the steam id is valid
		const isValid = await this.validateSteamId(id);
		if (!isValid) {
			this.setState({ isValidSteamId: false, loadingPlayerData: false });
			return;
		}
		this.setState({ id: id, isValidSteamId: true });

		// Check if the player wants to disable their stats (pp, global pos, etc)
		if (params.showPlayerStats === "false" || params.playerstats === "false") {
			this.setState({ showPlayerStats: false });
		}

		if (this.state.showPlayerStats == true || params.playerstats == "true") {
			setTimeout(async () => {
				await this.updateData(id);
			}, 10); // 10ms
		}

		let shouldConnectSocket = false;

		// Check if the player wants to show their current score information
		if (params.showScoreInfo === "true" || params.scoreinfo === "true") {
			this.setState({ showScore: true });
			shouldConnectSocket = true;
		}

		// Check if the player wants to show the current song
		if (params.showSongInfo === "true" || params.songinfo === "true") {
			this.setState({ showSongInfo: true });
			shouldConnectSocket = true;
		}

		if (shouldConnectSocket) {
			if (this.state.isConnectedToSocket) return;
			this.connectSocket(params.socketaddress);
		}
	}

	// Handle Errors
	static getDerivedStateFromError(error) {
		return this.setState({ hasError: true });
	}
	componentDidCatch(error, errorInfo) {
		console.log({ error, errorInfo });
	}
	// ---

	// I'd love if HTTP Status just gave this data lmao
	// HttpSiraStatus(https://github.com/denpadokei/HttpSiraStatus) does give this data.
	isCurrentSongTimeProvided = false;
	// we don't need to reset this to false because it is highly unlikely for a player to swap mods within a browser session

	/**
	 * Setup the timer for the song time
	 */
	setupTimer() {
		setInterval(() => {
			if (this.isCurrentSongTimeProvided) {
				return;
			}
			if (!this.state.paused && this.state.beatSaverData !== undefined) {
				this.setState({ currentSongTime: this.state.currentSongTime + 1 });
			}
		}, 1000);
	}

	/**
	 * Update the current song time
	 *
	 * @param {[]} data The song data
	 */
	handleCurrentSongTime(data) {
		try {
			const time = data.status.performance.currentSongTime;
			if (time !== undefined && time != null) {
				this.isCurrentSongTimeProvided = true;
				this.setState({ currentSongTime: time });
			}
		} catch (e) {
			// do nothing
		}
	}

	/**
	 * Fetch and update the data from the respective platform
	 *
	 * @param {string} id The steam id of the player
	 * @returns
	 */
	async updateData(id) {
		const data = await fetch(
			Utils.getWebsiteApi(this.state.websiteType).ApiUrl.PlayerData.replace(
				"%s",
				id
			),
			{
				headers: {
					"X-Requested-With": "BeatSaber Overlay",
				},
			}
		);
		try {
			const json = await data.json();
			this.setState({
				loadingPlayerData: false,
				id: id,
				data: json,
			});
		} catch (e) {
			// Catch error and use last known data
			console.error(e);
		}
	}

	/**
	 * Checks if the given steam id is valid or not
	 *
	 * @param {id} The Steam ID of the player to validate
	 */
	async validateSteamId(id) {
		if (id.length !== 17) {
			return false;
		}
		const data = await fetch(`/api/validateid?steamid=${id}`);
		const json = await data.json();
		return json.message === "Valid";
	}

	/**
	 * Setup the HTTP Status connection
	 */
	connectSocket(socketAddress) {
		socketAddress =
			(socketAddress === undefined
				? "ws://localhost"
				: `ws://${socketAddress}`) + ":6557/socket";
		if (this.state.isConnectedToSocket) return;

		if (this.state.isVisible) {
			this.resetData(false);
		}

		console.log(`Connecting to ${socketAddress}`);
		const socket = new WebSocket(socketAddress);
		socket.addEventListener("open", () => {
			console.log(`Connected to ${socketAddress}`);
			this.setState({ isConnectedToSocket: true });
		});
		socket.addEventListener("close", () => {
			console.log(
				"Attempting to re-connect to the HTTP Status socket in 60 seconds."
			);
			this.resetData(false);
			this.setState({ isConnectedToSocket: false });
			setTimeout(() => this.connectSocket(), 60_000);
		});
		socket.addEventListener("message", (message) => {
			const json = JSON.parse(message.data);
			this.handleCurrentSongTime(json);
			if (!this.handlers[json.event]) {
				console.log("Unhandled message from HTTP Status. (" + json.event + ")");
				return;
			}
			this.handlers[json.event](json || []);
		});
		this.setState({ socket: socket });
	}

	/**
	 * Set the current songs beat saver url in {@link #_beatSaverURL}
	 *
	 * @param {[]} songData
	 */
	async setBeatSaver(songData) {
		console.log("Updating BeatSaver info");
		const data = await fetch(
			this.#_beatSaverURL.replace("%s", songData.levelId)
		);
		const json = await data.json();
		this.setState({ beatSaverData: json });

		if (this.state.websiteType == "BeatLeader") {
			const { characteristic, levelId, difficulty } = songData;
			let mapHash = levelId.replace("custom_level_", "");
			const mapStars = await LeaderboardType.BeatLeader.getMapStarCount(
				mapHash,
				difficulty.replace("+", "Plus"),
				characteristic
			);
			this.setState({ mapStarCount: mapStars });
		}
	}

	/**
	 * Cleanup the data and get ready for the next song
	 *
	 * @param {boolean} visible Whether to show info other than the player stats
	 */
	async resetData(visible, loadedDuringSong = false) {
		if (this.state.showPlayerStats == true) {
			setTimeout(async () => {
				await this.updateData(this.state.id);
			}, 1000); // 1 second
		}
		this.setState({
			SaberA: {
				averageCut: [15.0],
				averagePreSwing: [70.0],
				averagePostSwing: [30.0],
			},
			SaberB: {
				averageCut: [15.0],
				averagePreSwing: [70.0],
				averagePostSwing: [30.0],
			},
			songInfo: undefined,
			beatSaverData: undefined,
			currentSongTime: 0,
			currentScore: 0,
			percentage: "100.00%",
			isVisible: visible,
			loadedDuringSong: loadedDuringSong,
			mapStarCount: undefined,
		});
	}

	// The HTTP Status handlers
	handlers = {
		hello: (data) => {
			console.log("Hello from HTTP Status!");
			if (
				data.status &&
				data.status.beatmap &&
				this.state.songData === undefined
			) {
				console.log("Going into level during song, resetting data.");
				this.resetData(true, true);
				this.setState({ songData: data, paused: false });
				this.setBeatSaver(data.status.beatmap);
			}
		},
		scoreChanged: (data) => {
			const { status } = data;
			const { score, relativeScore } = status.performance;
			let finalScore = score;
			if (finalScore == 0) {
				finalScore = this.state.currentScore;
			}
			const percent = relativeScore * 100;
			this.setState({
				currentScore: finalScore,
				percentage: percent.toFixed(2) + "%",
			});
		},
		noteFullyCut: (data) => {
			const { noteCut } = data;

			const cutData = this.state[noteCut.saberType];
			if (cutData.averageCut.includes(15) && cutData.averageCut.length === 1) {
				cutData.averageCut = [];
			}
			if (
				cutData.averagePreSwing.includes(70) &&
				cutData.averagePreSwing.length === 1
			) {
				cutData.averagePreSwing = [];
			}
			if (
				cutData.averagePostSwing.includes(30) &&
				cutData.averagePostSwing.length === 1
			) {
				cutData.averagePostSwing = [];
			}
			cutData.averagePreSwing.push(noteCut.beforeCutScore);
			cutData.averagePostSwing.push(noteCut.afterCutScore);
			cutData.averageCut.push(noteCut.cutDistanceScore);
			this.setState({ [noteCut.saberType]: cutData });
		},
		songStart: (data) => {
			console.log("Going into level, resetting data.");
			this.resetData(true);
			this.setState({ songData: data, paused: false });
			if (this.state.showScore) {
				this.setBeatSaver(data.status.beatmap);
			}
		},
		finished: () => {
			this.resetData(false);
		},
		softFail: () => {
			this.setState({ failed: true });
		},
		pause: () => {
			this.setState({ paused: true });
		},
		resume: () => {
			this.setState({ paused: false });
		},
		menu: () => {
			this.resetData(false);
		},
		noteCut: () => {},
		noteMissed: () => {},
		noteSpawned: () => {},
		bombMissed: () => {},
		beatmapEvent: () => {},
		energyChanged: () => {},
		obstacleEnter: () => {},
		obstacleExit: () => {},
	};

	render() {
		const {
			isValidSteamId,
			data,
			websiteType,
			showPlayerStats,
			loadingPlayerData,
			id,
		} = this.state;

		if (loadingPlayerData) {
			return <Spinner size="xl" color="white"></Spinner>;
		}

		return (
			<>
				<NextSeo title="Overlay"></NextSeo>
				<div className={styles.main}>
					{!isValidSteamId ? (
						<div className={styles.invalidPlayer}>
							<h1>Invalid player, please visit the main page.</h1>
							<Link href="/">
								<a>Go Home</a>
							</Link>
						</div>
					) : (
						<div className={styles.overlay}>
							{showPlayerStats && !loadingPlayerData ? (
								<PlayerStats
									pp={data.pp.toLocaleString()}
									globalPos={data.rank.toLocaleString()}
									country={data.country}
									countryRank={data.countryRank.toLocaleString()}
									websiteType={websiteType}
									avatar={`/api/steamavatar?steamid=${id}`}
									loadedDuringSong={this.state.loadedDuringSong}
								/>
							) : (
								<></>
							)}
							{this.state.showScore && this.state.isVisible ? (
								<ScoreStats data={this.state} />
							) : (
								<></>
							)}
							{this.state.showSongInfo &&
							this.state.beatSaverData !== undefined &&
							this.state.isVisible ? (
								<SongInfo data={this.state} />
							) : (
								<></>
							)}
						</div>
					)}
				</div>
			</>
		);
	}
}
