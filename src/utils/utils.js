import axios from "axios";
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

  static async isLeaderboardValid(url, steamId) {
    const response = await axios.get(url.replace("%s", steamId));
    if (response.status === 429) {
      return true; // Just assume it's true is we are rate limited
    }
    const json = response.data;
    return !!json.pp;
  }

  static calculatePP(stars, acc, type) {
    if (stars <= 0) {
      return undefined;
    }
    if (type === "BeatLeader") {
      const leaderboardData =
        useSongDataStore.getState().mapLeaderboardData.beatLeader;

      return getBeatLeaderPP(
        acc,
        leaderboardData.accRating,
        leaderboardData.passRating,
        leaderboardData.techRating
      );
    }
    if (type === "ScoreSaber") {
      return getScoreSaberPP(acc, stars);
    }
    return undefined;
  }

  static calculateModifierBonus() {
    const songMods = useSongDataStore.getState().songModifiers;
    const modifierMulipliers =
      useSongDataStore.getState().mapLeaderboardData.beatLeader.modifiers;
    let bonus = 1;

    // No Fail
    if (
      songMods.noFail == true &&
      modifierMulipliers.nf < 0 &&
      useSongDataStore.getState().failed
    ) {
      bonus -= modifierMulipliers.nf;
    }

    // Speed Modifiers
    if (songMods.songSpeed != "Normal") {
      if (songMods.songSpeed == "SuperSlow" && modifierMulipliers.ss > 0) {
        bonus -= modifierMulipliers.ss;
      }
      if (songMods.songSpeed == "Faster" && modifierMulipliers.fs > 0) {
        bonus += modifierMulipliers.fs;
      }
      if (songMods.songSpeed == "SuperFast" && modifierMulipliers.sf > 0) {
        bonus += modifierMulipliers.sf;
      }
    }

    // Disappearing Arrows
    if (songMods.disappearingArrows == true && modifierMulipliers.da > 0) {
      bonus += modifierMulipliers.da;
    }

    // Ghost Notes
    if (songMods.ghostNotes == true && modifierMulipliers.gn > 0) {
      toAdd += modifierMulipliers.gn;
    }

    // No Arrows
    if (songMods.noArrows == true && modifierMulipliers.na < 0) {
      bonus -= modifierMulipliers.na;
    }

    // No Bombs
    if (songMods.noBombs == true && modifierMulipliers.nb < 0) {
      bonus -= modifierMulipliers.nb;
    }

    // No Obstacles
    if (songMods.obstacles == false && modifierMulipliers.no < 0) {
      bonus -= modifierMulipliers.no;
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

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
