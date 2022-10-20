const mapCache = new Map();

module.exports = {
	BEATSAVER_MAP_API:
		process.env.NEXT_PUBLIC_HTTP_PROXY +
		"/https://api.beatsaver.com/maps/hash/%s",

	/**
	 * Gets a specified maps data from BeatSaver
	 *
	 * @param {string} hash
	 * @returns The map data
	 */
	async getMapData(hash) {
		hash = this.BEATSAVER_MAP_API.replace("%s", hash);
		if (mapCache.has(hash)) {
			// Return from cache
			return mapCache.get(hash);
		}

		const data = await fetch(hash, {
			headers: {
				origin: "Fascinated Overlay",
			},
		});
		if (data.status === 404) {
			return undefined;
		}
		const json = await data.json();
		mapCache.set(hash, json);
		setTimeout(() => {
			mapCache.delete(hash);
		}, 60 * 60 * 1000); // 1h
		return json;
	},
};
