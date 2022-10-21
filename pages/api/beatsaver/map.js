import { getMapData } from "../../../src/helpers/beatSaverHelpers";

export default async function handler(req, res) {
	const mapHash = req.query.hash;

	const mapData = await getMapData(mapHash);
	if (mapData === undefined) {
		// Check if a map hash was provided
		return res.status(404).json({
			status: 404,
			message: "Unknown Map Hash",
		});
	}
	const data = {
		// The maps data from the provided map hash
		bsr: mapData.id,
		songArt: `http://${req.headers.host}/api/beatsaver/art/${mapHash}?ext=${
			mapData.versions[0].coverURL.split("/")[3].split(".")[1]
		}`,
	};
	res.status(200).json({ error: false, data: data });
}
