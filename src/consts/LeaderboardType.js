import Config from "../../config.json";

const WebsiteTypes = {
	ScoreSaber: {
		ApiUrl: {
			PlayerData:
				Config.proxy_url + "/https://scoresaber.com/api/player/%s/basic",
		},
	},
	BeatLeader: {
		ApiUrl: {
			PlayerData: Config.proxy_url + "/https://api.beatleader.xyz/player/%s",
			MapData:
				Config.proxy_url +
				"/https://api.beatleader.xyz/leaderboard/hash/%h/%d/%m",
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
	Test: {
		ApiUrl: "/api/mockdata",
	},
};

export default WebsiteTypes;
