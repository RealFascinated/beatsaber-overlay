import { isValidSteamId } from "../../../src/helpers/validateSteamId";

export default async function handler(req, res) {
	const steamId = req.query.steamid;
	if (!steamId) {
		return res.status(404).json({
			status: 404,
			message: "Steam ID not provided",
		});
	}

	const isValid = await isValidSteamId(steamId);
	return res.status(200).json({
		status: "OK",
		message: isValid ? `Valid` : "Invalid",
	});
}
