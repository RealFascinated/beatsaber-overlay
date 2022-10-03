import {Component} from 'react'
import Avatar from '../components/Avatar';
import PlayerStats from '../components/PlayerStats';
import ScoreStats from '../components/ScoreStats';

import Config from '../config.json';
import SongInfo from "../components/SongInfo";

// Why do u have to proxy requests... it's so dumb LOL
const SCORESABER_API_URL = Config.proxy_url + "/https://scoresaber.com/api/player/%s/full";
const GITHUB_URL = "https://github.com/RealFascinated/beatsaber-overlay";

export default class Home extends Component {

	#_beatSaverURL = "";

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			id: undefined,
			isValidScoresaber: true,
			data: undefined,
			showPlayerStats: true,
			showScore: false,
			showSongInfo: false,

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
				averageCut: [15.00],
				averagePreSwing: [70.00],
				averagePostSwing: [30.00],
			},
			rightHand: {
				averageCut: [15.00],
				averagePreSwing: [70.00],
				averagePostSwing: [30.00],
			}
		}
		this.setupTimer();
	}

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
				return
			}
			if (!this.state.paused && this.state.beatSaverData !== undefined) {
				this.setState({ currentSongTime: this.state.currentSongTime + 1 })
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
			const time = data.status.performance.currentSongTime
			if (time !== undefined && time != null) {
				this.isCurrentSongTimeProvided = true
				this.setState({ currentSongTime: time })
			}
		} catch (e) {
			// do nothing
		}
	}

	async componentDidMount() {
		this.#_beatSaverURL = document.location.origin + "/api/beatsaver/map?hash=%s";
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());

		const id = params.id;
		if (!id) { // Check if the id param is valid
			this.setState({ loading: false, isValidScoresaber: false });
			return;
		}

		// Check if the player wants to disable their stats (pp, global pos, etc)
		if (params.playerstats === 'false') {
			this.setState({ showPlayerStats: false });
		}

		let shouldConnectSocket = false;

		// Check if the player wants to show their current score information
		if (params.scoreinfo === 'true') {
			this.setState({ showScore: true });
			shouldConnectSocket = true;
		}

		// Check if the player wants to show the current song
		if (params.songinfo === 'true') {
			this.setState({ showSongInfo: true });
			shouldConnectSocket = true;
		}

		if (shouldConnectSocket) {
			this.connectSocket();
		}

		await this.updateData(id);
		setTimeout(async () => {
			if (!this.state.isValidScoresaber) {
				return;
			}
			await this.updateData(id);
		}, 30_000); // Update the scoresaber data every 30 seconds.
	}

	/**
	 * Fetch and update the data from ScoreSaber
	 * 
	 * @param {string} id The scoresaber id of the player
	 * @returns 
	 */
	async updateData(id) {
		const data = await fetch(SCORESABER_API_URL.replace("%s", id), {
			mode: 'cors'
		});
		if (data.status === 422) { // Invalid scoresaber account (I think??)
			this.setState({ loading: false, isValidScoresaber: false });
			return;
		}
		const json = await data.json();
		if (json.errorMessage) { // Invalid scoresaber account
			this.setState({ loading: false, isValidScoresaber: false });
			return;
		}
		this.setState({ loading: false, id: id, data: json });
	}

	/**
	 * Setup the HTTP Status connection
	 */
	connectSocket() {
		const socket = new WebSocket('ws://localhost:6557/socket');
		socket.addEventListener('close', () => {
			console.log("Attempting to re-connect to the HTTP Status socket in 30 seconds.");
			setTimeout(() => this.connectSocket(), 30_000);
		});
		socket.addEventListener('message', (message) => {
			const json = JSON.parse(message.data);
			this.handleCurrentSongTime(json)
			if (!this.handlers[json.event]) {
				console.log("Unhandled message from HTTP Status. (" + json.event + ")");
				return;
			}
			this.handlers[json.event](json || []);
		})
		this.setState({ socket: socket });
	}

	/**
	 * Set the current songs beat saver url in {@link #_beatSaverURL}
	 * 
	 * @param {[]} songData 
	 */
	async setBeatSaver(songData) {
		console.log("Updating BeatSaver info")
		const data = await fetch(this.#_beatSaverURL.replace("%s", songData.levelId));
		const json = await data.json();
		this.setState({ beatSaverData: json })
	}

	/**
	 * Cleanup the data and get ready for the next song
	 * 
	 * @param {boolean} visible Whether to show info other than the player stats
	 */
	resetData(visible) {
		console.log("Exiting level, resetting data.")
		this.setState({
			"leftHand": {
				"averageCut": [15.00],
				"averagePreSwing": [70.00],
				"averagePostSwing": [30.00],
			},
			"rightHand": {
				"averageCut": [15.00],
				"averagePreSwing": [70.00],
				"averagePostSwing": [30.00],
			},
			songInfo: undefined,
			beatSaverData: undefined,
			currentSongTime: 0,
			currentScore: 0,
			percentage: "100.00%",
			isVisible: visible
		});
	}

	// The HTTP Status handlers
	handlers = {
		"hello": (data) => {
			console.log("Hello from HTTP Status!");
			if (data.status) {
				this.setState({songData: data});
				if (data.status.beatmap) {
					this.setBeatSaver(data.status.beatmap);
				}
			}
		},
		"scoreChanged": (data) => {
			const { status } = data;
			const { score, currentMaxScore } = status.performance;
			const percent = currentMaxScore > 0 ? ((score / currentMaxScore) * 1000 / 10).toFixed(2) : 0.00;
			this.setState({
				currentScore: score,
				percentage: this.state.failed ? percent * 2 : percent + "%"
			})
		},
		"noteFullyCut": (data) => {
			const { noteCut } = data;

			// Left Saber
			if (noteCut.saberType === 'SaberA') {
				const data = this.state.leftHand;
				if (data.averageCut.includes(15) && data.averageCut.length === 1) {
					data.averageCut = [];
				}
				if (data.averagePreSwing.includes(70) && data.averagePreSwing.length === 1) {
					data.averagePreSwing = [];
				}
				if (data.averagePostSwing.includes(30) && data.averagePostSwing.length === 1) {
					data.averagePostSwing = [];
				}
				data.averagePreSwing.push(noteCut.initialScore > 70 ? 70 : noteCut.initialScore);
				data.averagePostSwing.push(noteCut.finalScore - noteCut.initialScore);
				data.averageCut.push(noteCut.cutDistanceScore);
				this.setState({ leftHand: data });
			}

			// Left Saber
			if (noteCut.saberType === 'SaberB') {
				const data = this.state.rightHand;
				if (data.averageCut.includes(15) && data.averageCut.length === 1) {
					data.averageCut = [];
				}
				if (data.averagePreSwing.includes(70) && data.averagePreSwing.length === 1) {
					data.averagePreSwing = [];
				}
				if (data.averagePostSwing.includes(30) && data.averagePostSwing.length === 1) {
					data.averagePostSwing = [];
				}
				data.averagePreSwing.push(noteCut.initialScore > 70 ? 70 : noteCut.initialScore);
				data.averagePostSwing.push(noteCut.finalScore - noteCut.initialScore);
				data.averageCut.push(noteCut.cutDistanceScore);
				this.setState({ rightHand: data });
			}
		},
		"songStart": (data) => {
			console.log("Going into level, resetting data.")
			this.resetData(true);
			this.setState({ songData: data, paused: false })
			this.setBeatSaver(data.status.beatmap);
		},
		"finished": () => {
			console.log("Exiting level, resetting data.")
			this.resetData(false);
		},
		"softFail": () => {
			this.setState({ failed: true });
		},
		"pause": () => {
			this.setState({ paused: true });
		},
		"resume": () => {
			this.setState({ paused: false });
		},
		"menu": () => {
			console.log("Exiting level, resetting data.")
			this.resetData(false);
		},
		"noteCut": () => {},
		"noteMissed": () => {},
		"noteSpawned": () => {},
		"bombMissed": () => {},
		"beatmapEvent": () => {}
	}

	render() {
		const { loading, isValidScoresaber, data } = this.state;

		// When in the main menu, show this colour so it's actually readable
		if (!isValidScoresaber && !loading) {
			const body = document.body;
			body.style.backgroundColor = "#181a1b";
		}

		return <>
			{ loading ? 
			<div className={'loading'}>
				<h2>Loading...</h2>
			</div>
			: !isValidScoresaber ? 
			<div className={'invalid-player'}>
				<div style={{ fontWeight: 'bold', marginBottom: '50px' }}>
					<p>This is currently just a simple overlay for OBS displaying ScoreSaber stats.</p>
					<p>If you have any suggestions you can message me on discord @ Fascinated#4719</p>
				</div>
				<p>Provide a valid scoresaber id</p>
				<p>Example: {document.location.origin}?id=76561198449412074</p>
				<p>Example with Score Info: {document.location.origin}?id=76561198449412074&scoreinfo=true</p>
				<div className={'info'}>
					<div>
						<h3>Options</h3>
						<p>scoreinfo - Can be &quot;true&quot; if you want to show your current score (needs HTTP Status)</p>
						<p>playerstats - Can be &quot;false&quot; if you disable showing your stats (pp, global pos, etc)</p>
						<p>songinfo - Can be &quot;true&quot; if want to see information about the song (song name, bsr, song art, etc)</p>
						<br />
						<p>To use a option just add &key=value (eg: &songinfo=true)</p>
					</div>
				</div>
			</div> :
			<div className={'overlay'}>
				{ this.state.showPlayerStats ?
					<div className={'player-stats-container'}>
						<Avatar url={data.profilePicture} />
						<PlayerStats
							pp={data.pp.toLocaleString()}
							globalPos={data.rank.toLocaleString()}
							country={data.country}
							countryRank={data.countryRank.toLocaleString()}
						/>
					</div> :
					""
				}
				{
					this.state.showScore && this.state.isVisible ? <ScoreStats data={this.state} /> : ""
				}
				{
					this.state.showSongInfo && this.state.beatSaverData !== undefined && this.state.isVisible ? <SongInfo data={this.state}/> : ""
				}
			</div>
			}
		</>
	}
}