import { getMapData } from "../../../../src/helpers/beatSaverHelpers";

export default async function handler(req, res) {
	if (!req.query.hash) {
		return res.status(404).json({
			status: 404,
			message: "Invalid request",
		});
	}
	const mapHash = req.query.hash;

	const mapData = await getMapData(mapHash);
	if (mapData === undefined) {
		// Check if a map hash was provided
		return res.status(404).json({
			status: 404,
			message: "Unknown Map Hash",
		});
	}
	res.status(200).json({ status: "OK", data: mapData });
}
