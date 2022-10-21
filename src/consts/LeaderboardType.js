const WebsiteTypes = {
	ScoreSaber: {
		ApiUrl: {
			PlayerData:
				process.env.NEXT_PUBLIC_HTTP_PROXY +
				"/https://scoresaber.com/api/player/%s/basic",
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
		curve(acc, stars) {
			var l = 1 - (0.03 * (stars - 3.0)) / 11.0;
			var a = 0.96 * l;
			var f = 1.2 - (0.6 * stars) / 14.0;

			return Math.pow(Math.log10(l / (l - acc)) / Math.log10(l / (l - a)), f);
		},
		ppFromAcc(acc, stars) {
			if (stars === undefined || acc === undefined) {
				return undefined;
			}
			const pp = this.curve(acc / 100, stars - 0.5) * (stars + 0.5) * 42;
			return Number.isNaN(pp) ? undefined : pp;
		},
	},
};

export default WebsiteTypes;
