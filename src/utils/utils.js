import { default as LeaderboardType } from "../consts/LeaderboardType";
import { getBeatLeaderPP } from "../curve/BeatLeaderCurve";
import { getScoreSaberPP } from "../curve/ScoreSaberCurve";
import { useSongDataStore } from "../store/songDataStore";

export default class Utils {
	/**
	 * Returns the information for the given website type.
	 *
	 * @param {string} website
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
		if (stars <= 0) {
			return undefined;
		}
		if (type === "BeatLeader") {
			return getBeatLeaderPP(acc, stars) * (1 + this.calculateModifierBonus());
		}
		if (type === "ScoreSaber") {
			return getScoreSaberPP(acc, stars);
		}
		return undefined;
	}

	static calculateModifierBonus() {
		const songMods = useSongDataStore.getState().songModifiers;
		const modifierMulipliers =
			useSongDataStore.getState().mapLeaderboardData.modifiers;
		let bonus = 0;

		if (
			songMods.noFail == true &&
			modifierMulipliers.nf < 0 &&
			useSongDataStore.getState().failed
		) {
			bonus -= modifierMulipliers.nf;
		}

		if (songMods.songSpeed != "Normal") {
			if (songMods.songSpeed == "FasterSong" && modifierMulipliers.fs > 0) {
				bonus += modifierMulipliers.fs;
			}
			if (songMods.songSpeed == "SuperFast" && modifierMulipliers.sf > 0) {
				bonus += modifierMulipliers.sf;
			}
		}

		if (songMods.disappearingArrows == true && modifierMulipliers.da > 0) {
			bonus += modifierMulipliers.da;
		}

		if (songMods.ghostNotes == true && modifierMulipliers.gn > 0) {
			toAdd += modifierMulipliers.gn;
		}

		if (songMods.noArrows == true && modifierMulipliers.na < 0) {
			bonus -= modifierMulipliers.na;
		}

		if (songMods.noBombs == true && modifierMulipliers.nb < 0) {
			bonus -= modifierMulipliers.nb;
		}
		return bonus;
	}

	static base64ToArrayBuffer(base64) {
		return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
	}

	static stringToBoolean = (stringValue) => {
		switch (stringValue?.toLowerCase()?.trim()) {
			case "true":
			case "yes":
			case "1":
				return true;

			case "false":
			case "no":
			case "0":
			case null:
			case undefined:
				return false;

			default:
				return JSON.parse(stringValue);
		}
	};
}
