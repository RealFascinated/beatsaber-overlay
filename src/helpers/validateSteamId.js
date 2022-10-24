import { default as LeaderboardType } from "../consts/LeaderboardType";
import { getValue, setValue, valueExists } from "../utils/redisUtils";
import Utils from "../utils/utils";

const KEY = "VALID_STEAM_ID_";
const TO_CHECK = [
	LeaderboardType.ScoreSaber.ApiUrl.PlayerData,
	LeaderboardType.BeatLeader.ApiUrl.PlayerData,
];

export async function isValidSteamId(steamId) {
	if (!steamId) {
		return false;
	}
	if (steamId.length !== 17) {
		return false;
	}

	const exists = await valueExists(`${KEY}${steamId}`);
	if (exists) {
		const data = await getValue(`${KEY}${steamId}`);
		return Boolean(data);
	}

	const before = Date.now();
	let valid = false;
	for (const url of TO_CHECK) {
		const isValid = await Utils.checkLeaderboard(url, steamId);
		if (isValid) {
			valid = true;
			break;
		}
	}

	await setValue(`${KEY}${steamId}`, valid, valid ? 86400 * 7 : 86400); // Expire in a week if is valid
	console.log(
		`[Cache]: Cached Steam ID for id ${steamId} in ${Date.now() - before}ms`
	);
	return valid;
}
