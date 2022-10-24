import fetch from "node-fetch";
import WebsiteTypes from "../../../../src/consts/LeaderboardType";
import {
	getValue,
	setValue,
	valueExists,
} from "../../../../src/utils/redisUtils";
import { diffToScoreSaberDiff } from "../../../../src/utils/scoreSaberUtils";

const KEY = "SS_MAP_STAR_";

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export default async function handler(req, res) {
	if (!req.query.hash) {
		return res.status(404).json({
			status: 404,
			message: "Invalid request",
		});
	}
	const mapHash = req.query.hash.replace("custom_level_", "").toLowerCase();
	const difficulty = req.query.difficulty.replace(" ", "");
	const characteristic = req.query.characteristic;

	const key = `${KEY}${difficulty}-${characteristic}-${mapHash}`;
	const exists = await valueExists(key);
	if (exists) {
		const data = await getValue(key);
		res.setHeader("Cache-Status", "hit");

		return res.status(200).json({
			status: "OK",
			stars: Number.parseFloat(data),
			difficulty: difficulty,
		});
	}

	const before = Date.now();
	const data = await fetch(
		WebsiteTypes.ScoreSaber.ApiUrl.MapData.replace("%h", mapHash).replace(
			"%d",
			diffToScoreSaberDiff(difficulty)
		),
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
	let starCount = json.stars;
	if (starCount === undefined) {
		return res.status(404).json({
			status: 404,
			message: "Unknown Map Hash",
		});
	}
	await setValue(key, starCount);
	console.log(
		`[Cache]: Cached SS Star Count for hash ${mapHash} in ${
			Date.now() - before
		}ms`
	);
	res.setHeader("Cache-Status", "miss");
	return res.status(200).json({
		status: "OK",
		stars: starCount,
	});
}
