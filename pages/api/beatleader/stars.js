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
	const difficulty = req.query.difficulty;
	const characteristic = req.query.characteristic;

	const exists = await RedisUtils.exists(`${KEY}${mapHash}`);
	if (exists) {
		const data = await RedisUtils.getValue(
			`${KEY}-${difficulty}-${characteristic}-${mapHash}`
		);
		res.setHeader("Cache-Status", "hit");

		return res.status(200).json({
			status: "OK",
			stars: Number.parseFloat(data),
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
		return res.status(404).json({
			status: 404,
			message: "Unknown Map Hash",
		});
	}
	const json = await data.json();
	RedisUtils.setValue(
		`${KEY}-${difficulty}-${characteristic}-${mapHash}`,
		json.difficulty.stars
	);
	res.setHeader("Cache-Status", "miss");
	return res.status(200).json({
		status: "OK",
		stars: json.difficulty.stars,
	});
}
