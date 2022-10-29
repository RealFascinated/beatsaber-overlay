import env from "@beam-australia/react-env";
import axios from "axios";
import create from "zustand";
import Utils from "../utils/utils";
import { useSettingsStore } from "./overlaySettingsStore";

interface SongDataState {
	isLoading: boolean;
	hasError: boolean;
	inSong: boolean;
	songTitle: string;
	songSubTitle: string;
	songLength: number;
	songDifficulty: string;
	mapStarCount: number;
	mapArt: string;
	bsr: string;

	paused: boolean;
	failed: boolean;
	currentSongTime: number;
	currentScore: number;
	percentage: string;
	combo: number;
	currentPP: number | undefined;
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
	setPercent: (percent: string) => void;
	setCombo: (combo: number) => void;
	setPp: (percent: number) => void;
	setInSong: (isInSong: boolean) => void;
	setSaberData: (saberType: string, cutData: any) => void;
}

export const useSongDataStore = create<SongDataState>()((set) => ({
	isLoading: true,
	hasError: false,
	inSong: false,
	songTitle: "",
	songSubTitle: "",
	songLength: 0,
	songDifficulty: "",
	mapStarCount: 0,
	mapArt: "",
	bsr: "",

	paused: false,
	failed: false,
	currentSongTime: 0,
	currentScore: 0,
	percentage: "100",
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

	updateMapData: async (
		mapHash: string,
		mapDiff: string,
		characteristic: string,
		songTitle: string,
		songSubTitle: string,
		songLength: number
	) => {
		let hasError = false;
		const leaderboardType = useSettingsStore.getState().leaderboardType;

		const mapStars = await Utils.getWebsiteApi(leaderboardType).getMapStarCount(
			mapHash,
			mapDiff,
			characteristic
		);

		const mapData = await axios.get(
			`${env("SITE_URL")}/api/beatsaver/map?hash=${mapHash}`
		);
		if (mapData.status !== 200) {
			return set({ isLoading: false, hasError: hasError });
		}
		const { bsr, mapArt } = mapData.data.data;

		set({
			isLoading: false,
			hasError: hasError,
			mapStarCount: mapStars,
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

	setPercent: (percent: string) => {
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
		const leaderboardType = useSettingsStore.getState().leaderboardType;
		const mapStarCount = useSongDataStore.getState().mapStarCount;

		let pp = Utils.calculatePP(mapStarCount, percent, leaderboardType);
		if (pp === undefined) {
			return;
		}
		set({ currentPP: pp });
	},

	setInSong: (isInSong: boolean) => {
		set({ inSong: isInSong });
	},

	reset: () =>
		set({
			isLoading: true,
			hasError: false,
			songTitle: "",
			songSubTitle: "",
			songDifficulty: "",
			mapStarCount: 0,
			mapArt: "",
			bsr: "",

			paused: false,
			failed: false,
			currentSongTime: 0,
			currentScore: 0,
			percentage: "100",
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
