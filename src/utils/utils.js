import { default as LeaderboardType } from "../consts/LeaderboardType";
import BeatLeaderCurve from "../curve/BeatLeaderCurve";
import ScoreSaberCurve from "../curve/ScoreSaberCurve";

export default class Utils {
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
			return BeatLeaderCurve.getPP(acc, stars);
		}
		if (type === "ScoreSaber") {
			return ScoreSaberCurve.getPP(acc, stars);
		}
		return undefined;
	}

	static base64ToArrayBuffer(base64) {
		return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
	}
}
