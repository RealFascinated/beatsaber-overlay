import { BeatSaverMapData } from "../types/BeatSaverMapData";
import { getValue, setValue, valueExists } from "../utils/redisUtils";

const BEATSAVER_MAP_API =
	process.env.NEXT_PUBLIC_HTTP_PROXY +
	"/https://api.beatsaver.com/maps/hash/%s";

const KEY = "BS_MAP_DATA_";

function getLatestMapArt(data: BeatSaverMapData) {
	console.log(data);
	let url: string | undefined = undefined;
	for (const version of data.versions) {
		url = version.coverURL;
	}
	console.log(url);
	return url;
}

type MapData = {
	bsr: string;
	mapArt: string | undefined;
};

/**
 * Gets a specified maps data from BeatSaver
 *
 * @param {string} hash
 * @returns The map data
 */
export async function getMapData(hash: string): Promise<MapData | undefined> {
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
	const jsonResponse = await data.json();
	const json = {
		bsr: jsonResponse.id,
		mapArt: getLatestMapArt(jsonResponse),
	};
	await setValue(key, JSON.stringify(json));
	console.log(
		`[Cache]: Cached BS Map Data for hash ${mapHash} in ${
			Date.now() - before
		}ms`
	);
	return json;
}
