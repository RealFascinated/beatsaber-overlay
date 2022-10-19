import SteamIdCache from "../../src/caches/SteamIdCache";
import WebsiteTypes from "../consts/WebsiteType";

const TO_CHECK = [
	WebsiteTypes.ScoreSaber.ApiUrl,
	WebsiteTypes.BeatLeader.ApiUrl,
];

export default class Utils {
	constructor() {}

	/**
	 * Returns the information for the given website type.
	 *
	 * @param {WebsiteTypes} website
	 * @returns The website type's information.
	 */
	static getWebsiteApi(website) {
		return WebsiteTypes[website];
	}

	static openInNewTab(url) {
		window.open(url, "_blank");
	}

	static async isValidSteamId(steamId) {
		if (!steamId) {
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
		console.log(url.replace("%s", steamId));
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
}
