import env from "@beam-australia/react-env";
import axios from "axios";
import { create } from "zustand";
import Utils from "../utils/utils";

interface SongDataState {
	isLoading: boolean;
	hasError: boolean;
	inSong: boolean;
	songTitle: string;
	songSubTitle: string;
	songLength: number;
	songDifficulty: string;
	songModifiers: Object;
	mapLeaderboardData: {
		scoresaber: {
			stars: Number | undefined;
			modifiers: Object;
		};
		beatleader: {
			stars: Number | undefined;
			modifiers: Object;
		};
	};
	mapArt: string;
	bsr: string;

	paused: boolean;
	failed: boolean;
	currentSongTime: number;
	currentScore: number;
	percentage: number;
	combo: number;
	currentPP: {
		scoreSaber: number | undefined;
		beatLeader: number | undefined;
	};
	saberA: {
		cutDistanceScore: number;
		averagePreSwing: number;
		averagePostSwing: number;
	};
	saberB: {
		cutDistanceScore: number;
		averagePreSwing: number;
		averagePostSwing: number;
	};
	reset: () => void;
	updateMapData: (
		mapHash: string,
		mapDiff: string,
		characteristic: string,
		songTitle: string,
		songSubTitle: string,
		songLength: number
	) => void;
	setFailed: (failed: boolean) => void;
	setPaused: (paused: boolean) => void;
	setCurrentScore: (score: number) => void;
	setPercent: (percent: number) => void;
	setCombo: (combo: number) => void;
	setPp: (percent: number, attempt?: number) => void;
	setInSong: (isInSong: boolean) => void;
	setSaberData: (saberType: string, cutData: any) => void;
	setModifiers: (modifiers: Map<string, object>) => void;
}

export const useSongDataStore = create<SongDataState>()((set) => ({
	isLoading: true,
	hasError: false,
	inSong: false,
	songTitle: "",
	songSubTitle: "",
	songLength: 0,
	songDifficulty: "",
	songModifiers: {},
	mapLeaderboardData: {
		scoresaber: {
			stars: 0,
			modifiers: {},
		},
		beatleader: {
			stars: 0,
			modifiers: {},
		},
	},
	mapArt: "",
	bsr: "",

	paused: false,
	failed: false,
	currentSongTime: 0,
	currentScore: 0,
	percentage: 100,
	combo: 0,
	currentPP: {
		beatLeader: undefined,
		scoreSaber: undefined,
	},
	saberA: {
		cutDistanceScore: 0.0,
		averagePreSwing: 0.0,
		averagePostSwing: 0.0,
	},
	saberB: {
		cutDistanceScore: 0.0,
		averagePreSwing: 0.0,
		averagePostSwing: 0.0,
	},

	updateMapData: async (
		mapHash: string,
		mapDiff: string,
		characteristic: string,
		songTitle: string,
		songSubTitle: string,
		songLength: number
	) => {
		let hasError = false;
		//const leaderboardType = useSettingsStore.getState().leaderboardType;
		const beatLeaderLeaderboardData = await Utils.getWebsiteApi(
			"BeatLeader"
		).getMapLeaderboardData(mapHash, mapDiff, characteristic);

		const scoreSaberLeaderboardData = await Utils.getWebsiteApi(
			"ScoreSaber"
		).getMapLeaderboardData(mapHash, mapDiff, characteristic);

		const mapDataresponse = await axios.get(
			`${env("SITE_URL")}/api/beatsaver/map?hash=${mapHash}`
		);
		if (mapDataresponse.status !== 200) {
			return set({ isLoading: false, hasError: hasError });
		}
		const { bsr, mapArt } = mapDataresponse.data.data;

		set({
			isLoading: false,
			hasError: hasError,
			mapLeaderboardData: {
				beatleader: {
					stars: beatLeaderLeaderboardData.stars,
					modifiers: beatLeaderLeaderboardData.modifiers,
				},
				scoresaber: {
					stars: scoreSaberLeaderboardData.stars,
					modifiers: scoreSaberLeaderboardData.modifiers,
				},
			},
			bsr: bsr,
			mapArt: mapArt,
			songDifficulty: mapDiff,
			songTitle: songTitle,
			songSubTitle: songSubTitle,
			songLength: songLength,
		});
	},

	setFailed: (failed: boolean) => {
		set({ failed: failed });
	},

	setPaused: (paused: boolean) => {
		set({ paused: paused });
	},

	setCurrentScore: (score: number) => {
		set({ currentScore: score });
	},

	setPercent: (percent: number) => {
		set({ percentage: percent });
	},

	setCombo: (combo: number) => {
		set({ combo: combo });
	},

	setSaberData: (saberType: string, saberData: any) => {
		if (saberType === "saberA") {
			set({ saberA: saberData });
		} else if (saberType === "saberB") {
			set({ saberB: saberData });
		}
	},

	setPp: (percent: number) => {
		const leaderboardData = useSongDataStore.getState().mapLeaderboardData;
		// if (
		// 	leaderboardData.beatleader.stars == undefined ||
		// 	leaderboardData.scoresaber.stars == undefined
		// ) {
		// 	setTimeout(() => {
		// 		useSongDataStore.getState().setPp(percent);
		// 	}, 100);
		// }

		const scoreSaberMapStarCount = leaderboardData.scoresaber.stars;
		let scoreSaberPP = Utils.calculatePP(
			scoreSaberMapStarCount,
			percent,
			"ScoreSaber"
		);

		const beatLeaderMapStarCount = leaderboardData.beatleader.stars;
		let beatLeaderPP = Utils.calculatePP(
			beatLeaderMapStarCount,
			percent,
			"BeatLeader"
		);

		const lastSSPP = useSongDataStore.getState().currentPP?.scoreSaber;
		const lastBLPP = useSongDataStore.getState().currentPP?.beatLeader;

		set({
			currentPP: {
				beatLeader: beatLeaderPP == undefined ? lastBLPP : beatLeaderPP,
				scoreSaber: scoreSaberPP == undefined ? lastSSPP : scoreSaberPP,
			},
		});
	},

	setInSong: (isInSong: boolean) => {
		set({ inSong: isInSong });
	},

	setModifiers(modifiers: Map<string, object>) {
		set({ songModifiers: modifiers });
	},

	reset: () =>
		set({
			isLoading: true,
			hasError: false,
			songTitle: "",
			songSubTitle: "",
			songDifficulty: "",
			songModifiers: {},
			mapLeaderboardData: {
				scoresaber: {
					stars: undefined,
					modifiers: {},
				},
				beatleader: {
					stars: undefined,
					modifiers: {},
				},
			},
			mapArt: "",
			bsr: "",

			paused: false,
			failed: false,
			currentSongTime: 0,
			currentScore: 0,
			percentage: 100,
			combo: 0,
			currentPP: undefined,
			saberA: {
				cutDistanceScore: 0.0,
				averagePreSwing: 0.0,
				averagePostSwing: 0.0,
			},
			saberB: {
				cutDistanceScore: 0.0,
				averagePreSwing: 0.0,
				averagePostSwing: 0.0,
			},
		}),
}));
