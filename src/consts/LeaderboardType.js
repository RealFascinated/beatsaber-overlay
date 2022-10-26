const WebsiteTypes = {
	ScoreSaber: {
		ApiUrl: {
			PlayerData:
				process.env.NEXT_PUBLIC_HTTP_PROXY +
				"/https://scoresaber.com/api/player/%s/basic",
			MapData:
				"https://scoresaber.com/api/leaderboard/by-hash/%h/info?difficulty=%d",
		},
		async getMapStarCount(mapHash, mapDiff, characteristic) {
			const data = await fetch(
				`/api/scoresaber/stars?hash=${mapHash}&difficulty=${mapDiff}&characteristic=${characteristic}`
			);
			const json = await data.json();
			return json.stars || undefined;
		},
	},
	BeatLeader: {
		ApiUrl: {
			PlayerData:
				process.env.NEXT_PUBLIC_HTTP_PROXY +
				"/https://api.beatleader.xyz/player/%s",
			MapData: "https://api.beatleader.xyz/map/hash/%h",
		},
		async getMapStarCount(mapHash, mapDiff, characteristic) {
			const data = await fetch(
				`/api/beatleader/stars?hash=${mapHash}&difficulty=${mapDiff}&characteristic=${characteristic}`
			);
			const json = await data.json();
			return json.stars || undefined;
		},
	},
};

export default WebsiteTypes;
