import fetch from "node-fetch";
import BLMapStarCache from "../../../src/caches/BLMapStarCache";
import WebsiteTypes from "../../../src/consts/LeaderboardType";

export default async function handler(req, res) {
	const mapHash = req.query.hash.replace("custom_level_", "").toLowerCase();
	const difficulty = req.query.difficulty;
	const characteristic = req.query.characteristic;

	if (BLMapStarCache.has(mapHash)) {
		return res.json({
			status: "OK",
			message: "Cache hit for " + mapHash,
			stars: BLMapStarCache.get(mapHash),
		});
	}

	const data = await fetch(
		WebsiteTypes.BeatLeader.ApiUrl.MapData.replace("%h", mapHash)
			.replace("%d", difficulty.replace("+", "Plus"))
			.replace("%m", characteristic),
		{
			headers: {
				"X-Requested-With": "BeatSaber Overlay",
			},
		}
	);
	if (data.status === 404) {
		return res.json({
			status: 404,
			message: "Unknown hash",
		});
	}
	const json = await data.json();
	BLMapStarCache.set(mapHash, json.difficulty.stars);
	return res.json({
		status: "OK",
		message: "Cache miss for " + mapHash,
		stars: json.difficulty.stars,
	});
}
