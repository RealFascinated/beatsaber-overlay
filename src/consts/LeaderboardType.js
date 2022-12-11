import env from "@beam-australia/react-env";
import { VARS } from "./EnvVars";

const LeaderboardType = {
	ScoreSaber: {
		ApiUrl: {
			PlayerData:
				env(VARS.HTTP_PROXY) + "/https://scoresaber.com/api/player/%s/basic",
			MapData:
				"https://scoresaber.com/api/leaderboard/by-hash/%h/info?difficulty=%d",
		},
		async getMapLeaderboardData(mapHash, mapDiff, characteristic) {
			const data = await fetch(
				`/api/scoresaber/data?hash=${mapHash}&difficulty=${mapDiff}&characteristic=${characteristic}`
			);
			const json = await data.json();
			return json || undefined;
		},
	},
	BeatLeader: {
		ApiUrl: {
			PlayerData:
				env(VARS.HTTP_PROXY) + "/https://api.beatleader.xyz/player/%s",
			MapData: "https://api.beatleader.xyz/map/hash/%h",
		},
		async getMapLeaderboardData(mapHash, mapDiff, characteristic) {
			const data = await fetch(
				`/api/beatleader/data?hash=${mapHash}&difficulty=${mapDiff}&characteristic=${characteristic}`
			);
			const json = await data.json();
			return json || undefined;
		},
	},
};

export default LeaderboardType;
