import { getValue, setValue, valueExists } from "../utils/redisUtils";

const BEATSAVER_MAP_API =
	process.env.NEXT_PUBLIC_HTTP_PROXY +
	"/https://api.beatsaver.com/maps/hash/%s";

const KEY = "BS_MAP_DATA_";

/**
 * Gets a specified maps data from BeatSaver
 *
 * @param {string} hash
 * @returns The map data
 */
export async function getMapData(hash) {
	const mapHash = hash.replace("custom_level_", "").toLowerCase();

	const key = `${KEY}${mapHash}`;
	const exists = await valueExists(key);
	if (exists) {
		const data = await getValue(key);
		return JSON.parse(data);
	}

	const before = Date.now();
	const data = await fetch(BEATSAVER_MAP_API.replace("%s", mapHash), {
		headers: {
			"X-Requested-With": "BeatSaber Overlay",
		},
	});
	if (data.status === 404) {
		return undefined;
	}
	const json = await data.json();
	await setValue(key, JSON.stringify(json));
	console.log(
		`[Cache]: Cached BS Map Data for hash ${mapHash} in ${
			Date.now() - before
		}ms`
	);
	return json;
}
