import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useSettingsStore } from "../store/overlaySettingsStore";
import { usePlayerDataStore } from "../store/playerDataStore";
import { useSongDataStore } from "../store/songDataStore";
import Utils from "../utils/utils";
import { getMapHashFromLevelId } from "./map/mapHelpers";

const ip = useSettingsStore.getState().socketAddr;
let hasConnected = false;

let cutData: any = [];
cutData.saberA = {
	count: [0, 0, 0],
	totalScore: [0, 0, 0],
};
cutData.saberB = {
	count: [0, 0, 0],
	totalScore: [0, 0, 0],
};

const updatePlayerData = usePlayerDataStore.getState().updatePlayerData;

export function connectClient() {
	const client = new W3CWebSocket(`ws://${ip}:6557/socket`);

	if (hasConnected) {
		return;
	}

	client.onopen = () => {
		console.log("WebSocket Client Connected");
		hasConnected = true;
	};
	client.onclose = () => {
		if (hasConnected) {
			console.log(
				"Lost connection to HTTPSiraStatus, attempting to reconnect."
			);
			connectClient();
		} else {
			hasConnected = false;
			console.log(
				"Unable to connect to HTTPSiraStatus, retrying in 30 seconds."
			);

			setTimeout(() => {
				connectClient();
			}, 30_000);
		}
	};
	client.onmessage = (message: any) => {
		const data: string = message.data;
		const json = JSON.parse(data);
		if (!handlers[json.event]) {
			console.log("Unhandled message from HTTP Status. (" + json.event + ")");
			return;
		}
		handlers[json.event](json || []);
		try {
			const time = json.status.performance.currentSongTime;
			if (time !== undefined && time != null) {
				useSongDataStore.setState({ currentSongTime: time });
			}
		} catch (e) {}
	};
}

const handlers: any = {
	hello: (data: any) => {
		console.log("Hello from HttpSiraStatus");

		if (data.status && data.status.beatmap) {
			console.log("Going into level during song, resetting data.");
			const state = useSongDataStore.getState();
			const {
				levelId,
				difficultyEnum,
				characteristic,
				songName,
				songSubName,
				levelAuthorName,
				length,
			} = data.status.beatmap;
			state.reset();
			state.setInSong(true);
			state.updateMapData(
				getMapHashFromLevelId(levelId),
				difficultyEnum,
				characteristic,
				songName,
				songSubName || levelAuthorName,
				length
			);

			const { score, relativeScore } = data.status.performance;
			let finalScore = score;
			if (finalScore == 0) {
				finalScore = state.currentScore;
			}
			const percent = relativeScore * 100;

			state.setCurrentScore(finalScore);
			state.setPercent(percent.toFixed(2) + "%");
		}
	},

	songStart: (data: any) => {
		console.log("Going into level during song, resetting data.");
		const state = useSongDataStore.getState();
		const {
			levelId,
			difficultyEnum,
			characteristic,
			songName,
			songSubName,
			length,
		} = data.status.beatmap;

		state.reset();
		state.setInSong(true);
		state.updateMapData(
			getMapHashFromLevelId(levelId),
			difficultyEnum,
			characteristic,
			songName,
			songSubName,
			length
		);
	},

	scoreChanged: (data: any) => {
		const state = useSongDataStore.getState();
		const { status } = data;
		const { score, relativeScore } = status.performance;
		let finalScore = score;
		if (finalScore == 0) {
			finalScore = state.currentScore;
		}
		const percent = relativeScore * 100;

		state.setCurrentScore(finalScore);
		state.setPercent(percent.toFixed(2) + "%");

		const leaderboardType = useSettingsStore.getState().leaderboardType;
		let currentPP = Utils.calculatePP(
			state.mapStarCount,
			percent,
			leaderboardType
		);
		if (currentPP === undefined) {
			return;
		}

		state.setPp(currentPP);
	},

	noteFullyCut: (data: any) => {
		const { noteCut } = data;
		const state: any = useSongDataStore.getState();
		const parts = noteCut.saberType.split("Saber");
		const saberType = "saber" + parts[1];

		let beforeCutScore = 0.0;
		let afterCutScore = 0.0;
		let cutDistanceScore = 0.0;

		const cutDataSaber = cutData[saberType];
		cutDataSaber.count[0]++;
		cutDataSaber.count[1]++;
		cutDataSaber.count[2]++;
		cutDataSaber.totalScore[0] += noteCut.beforeCutScore;
		cutDataSaber.totalScore[1] += noteCut.afterCutScore;
		cutDataSaber.totalScore[2] += noteCut.cutDistanceScore;
		beforeCutScore = cutDataSaber.totalScore[0] / cutDataSaber.count[0];
		afterCutScore = cutDataSaber.totalScore[1] / cutDataSaber.count[1];
		cutDistanceScore = cutDataSaber.totalScore[2] / cutDataSaber.count[2];

		state.setSaberData(saberType, {
			averagePreSwing: beforeCutScore,
			averagePostSwing: afterCutScore,
			cutDistanceScore: cutDistanceScore,
		});
	},

	finished: () => {
		const state = useSongDataStore.getState();
		state.reset();
		state.setInSong(false);
		updatePlayerData();
	},
	menu: () => {
		const state = useSongDataStore.getState();
		state.reset();
		state.setInSong(false);
		updatePlayerData();
	},
	softFail: () => {
		const state = useSongDataStore.getState();
		state.setFailed(true);
	},
	pause: () => {
		const state = useSongDataStore.getState();
		state.setPaused(true);
	},
	resume: () => {
		const state = useSongDataStore.getState();
		state.setPaused(false);
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
