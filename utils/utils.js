import Config from '../config.json';

module.exports = {
    BEATSAVER_MAP_API: Config.proxy_url + "/https://api.beatsaver.com/maps/hash/%s",
    // todo: cache map data for 12 hrs

    /**
     * Gets a specified maps data from BeatSaver
     * 
     * @param {string} hash 
     * @returns The map data
     */
    async getMapData(hash) {
        const data = await fetch(this.BEATSAVER_MAP_API.replace("%s", hash), {
            headers: {
                "origin": "Fascinated Overlay"
            }
        });
        if (data.status === 404) {
            return undefined;
        }
        return await data.json();
    }
}