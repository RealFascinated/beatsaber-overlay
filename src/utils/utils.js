import SteamIdCache from "../../src/caches/SteamIdCache";
import {
	default as LeaderboardType,
	default as WebsiteTypes,
} from "../consts/LeaderboardType";

const TO_CHECK = [
	LeaderboardType.ScoreSaber.ApiUrl.PlayerData,
	LeaderboardType.BeatLeader.ApiUrl.PlayerData,
];

export default class Utils {
	constructor() {}

	/**
	 * Returns the information for the given website type.
	 *
	 * @param {LeaderboardType} website
	 * @returns The website type's information.
	 */
	static getWebsiteApi(website) {
		return LeaderboardType[website];
	}

	static openInNewTab(url) {
		window.open(url, "_blank");
	}

	static async isValidSteamId(steamId) {
		if (!steamId) {
			return false;
		}
		if (steamId.length !== 17) {
			return false;
		}

		if (SteamIdCache.has(steamId)) {
			return SteamIdCache.get(steamId);
		}

		let invalid = false;
		for (const url of TO_CHECK) {
			const isValid = await Utils.checkLeaderboard(url, steamId);

			if (isValid) {
				break;
			}
			if (!isValid) {
				invalid = true;
				break;
			}
		}

		SteamIdCache.set(steamId, invalid);
		return invalid;
	}

	static async checkLeaderboard(url, steamId) {
		const data = await fetch(url.replace("%s", steamId), {
			headers: {
				"X-Requested-With": "BeatSaber Overlay",
			},
		});
		if (data.status === 429) {
			return true; // Just assume it's true is we are rate limited
		}
		const json = await data.json();
		return !!json.pp;
	}

	static calculatePP(stars, acc, type) {
		if (type === "BeatLeader") {
			return WebsiteTypes.BeatLeader.ppFromAcc(acc, stars);
		}
		return undefined;
	}
}
