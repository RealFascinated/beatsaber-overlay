import fetch from "node-fetch";
import sharp from "sharp";
import { isValidSteamId } from "../../src/helpers/validateSteamId";
import { getValue, setValue, valueExists } from "../../src/utils/redisUtils";

const KEY = "STEAM_AVATAR_";
const ext = "jpg";

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export default async function handler(req, res) {
	const steamId = req.query.steamid;
	const isValid = await isValidSteamId(steamId);
	if (isValid == false) {
		return res.status(404).json({
			status: 404,
			message: "Unknown Steam Avatar",
		});
	}

	const exists = await valueExists(`${KEY}${steamId}`);
	if (exists) {
		const data = await getValue(`${KEY}${steamId}`);
		const buffer = Buffer.from(data, "base64");
		res.writeHead(200, {
			"Content-Type": "image/" + ext,
			"Content-Length": buffer.length,
			"Cache-Status": "hit",
		});
		return res.end(buffer);
	}

	const before = Date.now();
	const data = await fetch(
		`https://cdn.scoresaber.com/avatars/${steamId}.${ext}`
	);
	if (data.status === 404) {
		return res.status(404).json({
			status: 404,
			message: "Unknown Steam Avatar",
		});
	}

	let buffer = await data.buffer(); // Change to arrayBuffer at some point to make it shush
	buffer = await sharp(buffer).resize(400, 400).toBuffer();
	const bytes = buffer.toString("base64");

	await setValue(`${KEY}${steamId}`, bytes);
	console.log(
		`[Cache]: Cached Avatar for id ${steamId} in ${Date.now() - before}ms`
	);
	res.setHeader("Cache-Status", "miss");
	res.setHeader("Content-Type", "image/" + ext);
	res.status(200).send(buffer);
}
