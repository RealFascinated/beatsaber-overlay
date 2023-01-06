import env from "@beam-australia/react-env";
import axios from "axios";
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
			const response = await axios.get(
				`/api/scoresaber/data?hash=${mapHash}&difficulty=${mapDiff}&characteristic=${characteristic}`
			);
			return response.data || undefined;
		},
	},
	BeatLeader: {
		ApiUrl: {
			PlayerData:
				env(VARS.HTTP_PROXY) + "/https://api.beatleader.xyz/player/%s",
			MapData: "https://api.beatleader.xyz/map/hash/%h",
		},
		async getMapLeaderboardData(mapHash, mapDiff, characteristic) {
			const response = await axios.get(
				`/api/beatleader/data?hash=${mapHash}&difficulty=${mapDiff}&characteristic=${characteristic}`
			);
			return response.data || undefined;
		},
	},
};

export default LeaderboardType;
