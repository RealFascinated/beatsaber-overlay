import axios from "axios";
import { create } from "zustand";
import Utils from "../utils/utils";
import { useSettingsStore } from "./overlaySettingsStore";

interface PlayerDataState {
	isLoading: boolean;
	id: string;
	pp: number;
	avatar: string;
	globalPos: number;
	countryRank: number;
	country: string;
	updatePlayerData: () => void;
}

export const usePlayerDataStore = create<PlayerDataState>()((set) => ({
	isLoading: true,
	id: "",
	pp: 0,
	avatar: "",
	globalPos: 0,
	countryRank: 0,
	country: "",

	updatePlayerData: async () => {
		const leaderboardType = useSettingsStore.getState().leaderboardType;
		const playerId = useSettingsStore.getState().id;

		const apiUrl = Utils.getWebsiteApi(
			leaderboardType
		).ApiUrl.PlayerData.replace("%s", playerId);
		const response = await axios.get(apiUrl, {
			headers: {
				"x-requested-with": "BeatSaber Overlay",
			},
		});
		if (response.status !== 200) {
			return;
		}
		const data = response.data;

		console.log("Updated player data");

		set(() => ({
			id: playerId,
			isLoading: false,
			pp: data.pp,
			avatar: data.avatar || data.profilePicture,
			globalPos: data.rank,
			countryRank: data.countryRank,
			country: data.country,
		}));
	},
}));
