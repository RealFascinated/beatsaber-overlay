import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useDataStore } from "../store/overlayDataStore";
import { useSettingsStore } from "../store/overlaySettingsStore";
import { usePlayerDataStore } from "../store/playerDataStore";
import { useSongDataStore } from "../store/songDataStore";
import { getMapHashFromLevelId } from "./map/mapHelpers";

const ip = useSettingsStore.getState().socketAddr || "localhost";
const updatePlayerData = usePlayerDataStore.getState().updatePlayerData;

let cutData: any = [];
resetCutState();

function resetCutState() {
	cutData.saberA = {
		count: [0, 0, 0],
		totalScore: [0, 0, 0],
	};
	cutData.saberB = {
		count: [0, 0, 0],
		totalScore: [0, 0, 0],
	};
}

export function connectClient(attempt: number = 1) {
	const client = new W3CWebSocket(`ws://${ip}:6557/socket`);
	const retryTime = 30_000 * attempt > 60_000 ? 60_000 : 30_000 * attempt;

	client.onopen = () => {
		console.log("WebSocket Client Connected");
	};
	client.onclose = () => {
		console.log(
			`Unable to connect to HTTPSiraStatus, retrying in ${
				retryTime / 1000
			} seconds. (Attempt: ${attempt})`
		);

		setTimeout(() => {
			connectClient(attempt + 1);
		}, retryTime);
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
			resetCutState();
			state.setInSong(true);
			state.setCombo(data.status.performance.combo);
			state.setModifiers(data.status.mod);
			useDataStore.setState({ loadedDuringSong: true });

			const { score, relativeScore } = data.status.performance;
			let finalScore = score;
			if (finalScore == 0) {
				finalScore = state.currentScore;
			}
			const percent = relativeScore * 100;

			state.setCurrentScore(finalScore);
			state.setPercent(percent);
			state.setPp(percent);
			state.updateMapData(
				getMapHashFromLevelId(levelId),
				difficultyEnum,
				characteristic,
				songName,
				songSubName || levelAuthorName,
				length
			);
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
			levelAuthorName,
			length,
		} = data.status.beatmap;

		state.reset();
		resetCutState();
		state.setInSong(true);
		state.setModifiers(data.status.mod);
		state.updateMapData(
			getMapHashFromLevelId(levelId),
			difficultyEnum,
			characteristic,
			songName,
			songSubName || levelAuthorName,
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
		state.setPercent(percent);
		state.setCombo(data.status.performance.combo);
		state.setPp(percent);
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
		resetCutState();
		state.setInSong(false);
		updatePlayerData();
		useDataStore.setState({ loadedDuringSong: false });
	},
	menu: () => {
		const state = useSongDataStore.getState();
		state.reset();
		resetCutState();
		state.setInSong(false);
		updatePlayerData();
		useDataStore.setState({ loadedDuringSong: false });
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
