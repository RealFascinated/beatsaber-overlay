import WebsiteTypes from "../../src/consts/WebsiteType";

const TO_CHECK = [
	WebsiteTypes.ScoreSaber.ApiUrl,
	WebsiteTypes.BeatLeader.ApiUrl,
];

// TODO: Cache the result
export default async function handler(req, res) {
	const steamId = req.query.steamid;
	if (!steamId) {
		return res.json({
			status: 404,
			message: "Steam id not provided: Provide in the query.",
		});
	}

	let invalid = false;
	for (const url of TO_CHECK) {
		const isValid = await checkLeaderboard(url, steamId);

		if (isValid) {
			break;
		}
		if (!isValid) {
			invalid = true;
			break;
		}
	}

	return res.json({
		status: "OK",
		message: invalid ? `Invalid` : "Valid",
	});
}

async function checkLeaderboard(url, steamId) {
	console.log(url.replace("%s", steamId));
	const data = await fetch(url.replace("%s", steamId), {
		headers: {
			"X-Requested-With": "BeatSaber Overlay",
		},
	});
	if (data.status === 429) {
		return true; // Just assume it's true is we are rate limited
	}
	const json = await data.json();

	return !!json.pp;
}
