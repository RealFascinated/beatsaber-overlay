import Utils from "../../../utils/utils";

export default async function handler(req, res) {
	const mapHash = req.query.hash;

	const mapData = await Utils.getMapData(mapHash.replace("custom_level_", ""));
	if (mapData === undefined) {
		// Check if a map hash was provided
		return res.status(200).json({ error: true, message: "Unknown map" });
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
