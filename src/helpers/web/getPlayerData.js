import axios from "axios";
import LeaderboardType from "../../consts/LeaderboardType";

export async function getPlayerData(leaderboardType, playerId) {
  const data = await axios.get(
    LeaderboardType[leaderboardType].ApiUrl.PlayerData.replace("%s", playerId)
  );
  return data;
}
