import fetch from "node-fetch";
import WebsiteTypes from "../../../src/consts/LeaderboardType";
import RedisUtils from "../../../src/utils/redisUtils";

const KEY = "BL_MAP_STAR_";

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export default async function handler(req, res) {
	const mapHash = req.query.hash.replace("custom_level_", "").toLowerCase();
	const difficulty = req.query.difficulty.replace(" ", "");
	const characteristic = req.query.characteristic;

	const key = `${KEY}${difficulty}-${characteristic}-${mapHash}`;
	const exists = await RedisUtils.exists(key);
	if (exists) {
		const data = await RedisUtils.getValue(key);
		res.setHeader("Cache-Status", "hit");

		return res.status(200).json({
			status: "OK",
			stars: Number.parseFloat(data),
			difficulty: difficulty,
		});
	}

	const before = Date.now();
	const data = await fetch(
		WebsiteTypes.BeatLeader.ApiUrl.MapData.replace("%h", mapHash)
			.replace("%d", difficulty)
			.replace("%m", characteristic),
		{
			headers: {
				"X-Requested-With": "BeatSaber Overlay",
			},
		}
	);
	if (data.status === 404) {
		return res.status(404).json({
			status: 404,
			message: "Unknown Map Hash",
		});
	}
	const json = await data.json();
	let starCount = undefined;
	for (const diff of json.difficulties) {
		if (
			diff.difficultyName === difficulty &&
			diff.modeName === characteristic
		) {
			starCount = diff.stars;
		}
	}
	if (starCount === undefined) {
		return res.status(404).json({
			status: 404,
			message: "Unknown Map Hash",
		});
	}
	await RedisUtils.setValue(key, starCount);
	console.log(
		`[Cache]: Cached BL Star Count for hash ${mapHash} in ${
			Date.now() - before
		}ms`
	);
	res.setHeader("Cache-Status", "miss");
	return res.status(200).json({
		status: "OK",
		stars: starCount,
	});
}
