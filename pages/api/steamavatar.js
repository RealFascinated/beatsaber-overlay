import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import sharp from "sharp";
import cacheDir from "../../src/caches/SteamAvatarCacheDir";
import Utils from "../../src/utils/utils";

export default async function handler(req, res) {
	const steamId = req.query.steamid;
	const isValid = await Utils.isValidSteamId(steamId);
	if (isValid == true) {
		return res.json({
			status: "OK",
			message: `Invalid steam id`,
		});
	}

	const imagePath = cacheDir + path.sep + steamId + ".jpg";
	const exists = fs.existsSync(imagePath);
	if (!exists) {
		const data = await fetch(
			`https://cdn.scoresaber.com/avatars/${steamId}.jpg`
		);
		let buffer = await data.buffer();
		buffer = await sharp(buffer).resize(150, 150).toBuffer();
		fs.writeFileSync(imagePath, buffer);
		res.setHeader("Content-Type", "image/" + ext);
		res.send(buffer);
		console.log('Steam Avatar Cache - Added avatar "' + mapHash + '"');
		return;
	}
	const buffer = fs.readFileSync(imagePath);
	res.setHeader("Content-Type", "image/jpg");
	res.send(buffer);
}
