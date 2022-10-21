import fetch from "node-fetch";
import sharp from "sharp";
import {
	getValue,
	setValue,
	valueExists,
} from "../../../../src/utils/redisUtils";

const KEY = "BS_MAP_ART_";

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export default async function handler(req, res) {
	const mapHash = req.query.hash.replace("custom_level_", "").toLowerCase();
	const ext = req.query.ext || "jpg";

	const exists = await valueExists(`${KEY}${mapHash}`.replace(" ", ""));
	if (exists) {
		const data = await getValue(`${KEY}${mapHash}`);
		const buffer = Buffer.from(data, "base64");
		res.writeHead(200, {
			"Content-Type": "image/" + ext,
			"Content-Length": buffer.length,
			"Cache-Status": "hit",
		});
		return res.end(buffer);
	}

	const before = Date.now();
	const data = await fetch(`https://eu.cdn.beatsaver.com/${mapHash}.${ext}`);
	if (data.status === 404) {
		return res.status(404).json({
			status: 404,
			message: "Unknown Map Hash",
		});
	}

	let buffer = await data.buffer(); // Change to arrayBuffer at some point to make it shush
	buffer = await sharp(buffer).resize(400, 400).toBuffer();
	const bytes = buffer.toString("base64");

	await setValue(`${KEY}${mapHash}`.replace(" ", ""), bytes);
	console.log(
		`[Cache]: Cached BS Song Art for hash ${mapHash} in ${
			Date.now() - before
		}ms`
	);
	res.setHeader("Cache-Status", "miss");
	res.setHeader("Content-Type", "image/" + ext);
	res.status(200).send(buffer);
}
