import { create } from "zustand";
import Utils from "../utils/utils";

interface SettingsState {
	mounted: boolean;
	id: string;
	socketAddr: string;
	leaderboardType: string;
	showPlayerStats: boolean;
	showScoreInfo: boolean;
	showSongInfo: boolean;
	showCutStats: boolean;
	shouldReplacePlayerInfoWithScore: boolean;
	songTimeHex: string;
	setMounted: (isMounted: boolean) => void;
	setOverlaySettings: (params: string) => void;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
	mounted: false,
	id: "",
	socketAddr: "localhost",
	leaderboardType: "ScoreSaber",
	showPlayerStats: true,
	showScoreInfo: false,
	showSongInfo: false,
	showCutStats: false,
	shouldReplacePlayerInfoWithScore: false,
	songTimeHex: "FF0000",

	setMounted: (isMounted: boolean) => set(() => ({ mounted: isMounted })),
	setOverlaySettings: (params: any) =>
		set(() => {
			let values: any = {};
			Object.entries(params).forEach((value) => {
				if (value[0] !== undefined) {
					if (value[1] == "true" || value[1] == "false") {
						values[value[0]] = Utils.stringToBoolean(value[1]);
					} else {
						values[value[0]] = value[1];
					}
				}
			});
			return values;
		}),
}));
