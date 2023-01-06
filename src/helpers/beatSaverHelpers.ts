import env from "@beam-australia/react-env";
import axios from "axios";
import { VARS } from "../consts/EnvVars";
import { BeatSaverMapData } from "../types/BeatSaverMapData";
import { getValue, setValue, valueExists } from "../utils/redisUtils";

const BEATSAVER_MAP_API =
	env(VARS.HTTP_PROXY) + "/https://api.beatsaver.com/maps/hash/%s";

const KEY = "BS_MAP_DATA_";

function getLatestMapArt(data: BeatSaverMapData) {
	let url: string | undefined = undefined;
	for (const version of data.versions) {
		url = version.coverURL;
	}
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
	const response = await axios.get(BEATSAVER_MAP_API.replace("%s", mapHash), {
		headers: {
			"X-Requested-With": "BeatSaber Overlay",
		},
	});
	if (response.status === 404) {
		return undefined;
	}
	const jsonResponse = response.data;
	const json = {
		bsr: jsonResponse.id,
		mapArt: getLatestMapArt(jsonResponse),
	};
	await setValue(key, JSON.stringify(json), 86400 * 7); // Expire in a week
	console.log(
		`[Cache]: Cached BS Map Data for hash ${mapHash} in ${
			Date.now() - before
		}ms`
	);
	return json;
}
