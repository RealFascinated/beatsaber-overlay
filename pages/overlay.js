import { Link } from "@nextui-org/react";
import { Component } from "react";
import PlayerStats from "../src/components/PlayerStats";
import ScoreStats from "../src/components/ScoreStats";
import SongInfo from "../src/components/SongInfo";
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
			textColor: undefined,

			socket: undefined,
			isVisible: false,
			songInfo: undefined,
			beatSaverData: undefined,
			currentSongTime: 0,
			paused: true,
			currentScore: 0,
			percentage: "100.00%",
			failed: false,
			leftHand: {
				averageCut: [15.0],
				averagePreSwing: [70.0],
				averagePostSwing: [30.0],
			},
			rightHand: {
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
			this.setState({ isValidSteamId: false });

			return;
		}

		// Checks if the steam id is valid
		const isValid = await this.validateSteamId(id);
		if (!isValid) {
			this.setState({ isValidSteamId: false });
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

		// Mainly used for the preview
		if (params.textColor) {
			this.setState({ textColor: params.textColor });
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
			Utils.getWebsiteApi(
				id == "test" ? "Test" : this.state.websiteType
			).ApiUrl.replace("%s", id),
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
		const data = await fetch(`/api/validateid?steamid=${id}`);
		const json = await data.json();
		return json.message === "Valid" ? true : false;
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
	}

	/**
	 * Cleanup the data and get ready for the next song
	 *
	 * @param {boolean} visible Whether to show info other than the player stats
	 */
	async resetData(visible) {
		if (this.state.showPlayerStats == true) {
			setTimeout(async () => {
				await this.updateData(this.state.id);
			}, 1000); // 1 second
		}
		this.setState({
			leftHand: {
				averageCut: [15.0],
				averagePreSwing: [70.0],
				averagePostSwing: [30.0],
			},
			rightHand: {
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
		});
	}

	// The HTTP Status handlers
	handlers = {
		hello: (data) => {
			console.log("Hello from HTTP Status!");
			if (data.status) {
				this.setState({ songData: data });
				if (data.status.beatmap) {
					this.setBeatSaver(data.status.beatmap);
				}
			}
		},
		scoreChanged: (data) => {
			const { status } = data;
			const { score, currentMaxScore } = status.performance;
			const percent =
				currentMaxScore > 0
					? (((score / currentMaxScore) * 1000) / 10).toFixed(2)
					: 0.0;
			this.setState({
				currentScore: score,
				percentage: this.state.failed ? percent * 2 : percent + "%",
			});
		},
		noteFullyCut: (data) => {
			const { noteCut } = data;

			// Left Saber
			if (noteCut.saberType === "SaberA") {
				const data = this.state.leftHand;
				if (data.averageCut.includes(15) && data.averageCut.length === 1) {
					data.averageCut = [];
				}
				if (
					data.averagePreSwing.includes(70) &&
					data.averagePreSwing.length === 1
				) {
					data.averagePreSwing = [];
				}
				if (
					data.averagePostSwing.includes(30) &&
					data.averagePostSwing.length === 1
				) {
					data.averagePostSwing = [];
				}
				data.averagePreSwing.push(noteCut.beforeSwingRating * 70);
				data.averagePostSwing.push(noteCut.afterSwingRating * 30);
				data.averageCut.push(noteCut.cutDistanceScore);
				this.setState({ leftHand: data });
			}

			// Left Saber
			if (noteCut.saberType === "SaberB") {
				const data = this.state.rightHand;
				if (data.averageCut.includes(15) && data.averageCut.length === 1) {
					data.averageCut = [];
				}
				if (
					data.averagePreSwing.includes(70) &&
					data.averagePreSwing.length === 1
				) {
					data.averagePreSwing = [];
				}
				if (
					data.averagePostSwing.includes(30) &&
					data.averagePostSwing.length === 1
				) {
					data.averagePostSwing = [];
				}
				data.averagePreSwing.push(noteCut.beforeSwingRating * 70);
				data.averagePostSwing.push(noteCut.afterSwingRating * 30);
				data.averageCut.push(noteCut.cutDistanceScore);
				this.setState({ rightHand: data });
			}
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

		if (this.state.textColor !== undefined) {
			const element = document.querySelector("." + styles.main);
			element.style.color = this.state.textColor;
		}

		return (
			<div className={styles.main}>
				{!isValidSteamId && !loadingPlayerData ? (
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
		);
	}
}
