import Utils from "../../src/utils/utils";

export default async function handler(req, res) {
	const steamId = req.query.steamid;
	if (!steamId) {
		return res.json({
			status: 404,
			message: "Steam id not provided: Provide in the query.",
		});
	}

	const isValid = await Utils.isValidSteamId(steamId);
	return res.json({
		status: "OK",
		message: !isValid ? `Valid` : "Invalid",
	});
}
