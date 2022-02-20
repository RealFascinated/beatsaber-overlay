import Utils from '../../../utils/utils'

export default async function handler(req, res) {
    const mapHash = req.query.hash;

    const mapData = await Utils.getMapData(mapHash.replace("custom_level_", ""));
    if (mapData === undefined) {
        return res.json({ error: true, message: "Unknown map" })
    }
    const data = {
        bsr: mapData.id,
        songArt: "http://" + req.headers.host + "/api/beatsaver/art/" + mapHash + "?ext=" + mapData.versions[0].coverURL.split("/")[3].split(".")[1]
    };
    res.json({ error: false, data: data })
}
