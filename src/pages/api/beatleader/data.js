import axios from "axios";
import WebsiteTypes from "../../../consts/LeaderboardType";
import { getValue, setValue, valueExists } from "../../../utils/redisUtils";

const KEY = "BL_MAP_DATA_";

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export default async function handler(req, res) {
  if (!req.query.hash || !req.query.difficulty || !req.query.characteristic) {
    return res.status(404).json({
      status: 404,
      message: "Invalid request",
    });
  }
  const mapHash = req.query.hash.replace("custom_level_", "").toLowerCase();
  const difficulty = req.query.difficulty.replace(" ", "");
  const characteristic = req.query.characteristic;

  const key = `${KEY}${difficulty}-${characteristic}-${mapHash}`;
  const exists = await valueExists(key);
  if (exists) {
    const data = await getValue(key);
    const json = JSON.parse(data);
    res.setHeader("Cache-Status", "hit");

    return res.status(200).json({
      status: "OK",
      difficulty: difficulty,
      stars: json.stars,
      modifiers: json.modifiers,
      passRating: json.passRating,
      accRating: json.accRating,
      techRating: json.techRating,
    });
  }

  const before = Date.now();
  const reesponse = await axios.get(
    WebsiteTypes.BeatLeader.ApiUrl.MapData.replace("%h", mapHash)
  );
  if (reesponse.status === 404) {
    return res.status(404).json({
      status: 404,
      message: "Unknown Map Hash",
    });
  }
  const json = reesponse.data;
  let starCount = undefined;
  let modifiers = undefined;
  let passRating = undefined;
  let accRating = undefined;
  let techRating = undefined;

  for (const diff of json.difficulties) {
    if (
      diff.difficultyName === difficulty &&
      diff.modeName === characteristic
    ) {
      starCount = diff.stars;
      modifiers = diff.modifierValues;
      passRating = diff.passRating;
      accRating = diff.accRating;
      techRating = diff.techRating;
    }
  }
  if (starCount === undefined) {
    return res.status(404).json({
      status: 404,
      message: "Unknown Map Hash",
    });
  }
  await setValue(
    key,
    JSON.stringify({
      stars: starCount,
      modifiers: modifiers,
      passRating: passRating,
      accRating: accRating,
      techRating: techRating,
    })
  );
  console.log(
    `[Cache]: Cached BL Star Count for hash ${mapHash} in ${
      Date.now() - before
    }ms`
  );
  res.setHeader("Cache-Status", "miss");
  return res.status(200).json({
    status: "OK",
    difficulty: difficulty,
    stars: starCount,
    modifiers: modifiers,
    passRating: passRating,
    accRating: accRating,
    techRating: techRating,
  });
}
