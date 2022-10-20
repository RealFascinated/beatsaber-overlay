import { default as LeaderboardType } from "../consts/LeaderboardType";
import RedisUtils from "../utils/redisUtils";
import Utils from "../utils/utils";

const KEY = "VALID_STEAM_ID_";
const TO_CHECK = [
	LeaderboardType.ScoreSaber.ApiUrl.PlayerData,
	LeaderboardType.BeatLeader.ApiUrl.PlayerData,
];

async function isValidSteamId(steamId) {
	if (!steamId) {
		return false;
	}
	if (steamId.length !== 17) {
		return false;
	}

	const exists = await RedisUtils.exists(`${KEY}${steamId}`);
	if (exists) {
		const data = await RedisUtils.getValue(`${KEY}${steamId}`);
		return Boolean(data);
	}

	let valid = false;
	for (const url of TO_CHECK) {
		const isValid = await Utils.checkLeaderboard(url, steamId);
		if (isValid) {
			valid = true;
			break;
		}
	}

	await RedisUtils.setValue(`${KEY}${steamId}`, valid);
	return valid;
}

module.exports = {
	isValidSteamId,
};
