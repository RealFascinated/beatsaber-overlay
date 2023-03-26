import Utils from "../utils/utils";

/**
 * The pp curve of this leaderboard
 */
const ppCurve = [
	[1.0, 7.424],
	[0.999, 6.241],
	[0.9975, 5.158],
	[0.995, 4.01],
	[0.9925, 3.241],
	[0.99, 2.7],
	[0.9875, 2.303],
	[0.985, 2.007],
	[0.9825, 1.786],
	[0.98, 1.618],
	[0.9775, 1.49],
	[0.975, 1.392],
	[0.9725, 1.315],
	[0.97, 1.256],
	[0.965, 1.167],
	[0.96, 1.101],
	[0.955, 1.047],
	[0.95, 1.0],
	[0.94, 0.919],
	[0.93, 0.847],
	[0.92, 0.786],
	[0.91, 0.734],
	[0.9, 0.692],
	[0.875, 0.606],
	[0.85, 0.537],
	[0.825, 0.48],
	[0.8, 0.429],
	[0.75, 0.345],
	[0.7, 0.286],
	[0.65, 0.246],
	[0.6, 0.217],
	[0.0, 0.0],
];

/**
 * https://github.com/BeatLeader/beatleader-server/blob/master/Utils/ReplayUtils.cs#L45
 * funky shit from ^
 *
 * @param {Number} accuracy the accuracy of the score
 * @param {Number} accRating the acc rating of the difficulty
 * @param {Number} passRating the pass rating of the difficulty
 * @param {Number} techRating the tech rating of the difficulty
 * @returns
 */
export function getBeatLeaderPP(accuracy, accRating, passRating, techRating) {
	const modifierBonus = Utils.calculateModifierBonus();
	const ppValues = getPP(
		accuracy,
		accRating,
		passRating * modifierBonus,
		techRating * modifierBonus
	);
	const pp = inflate(ppValues.passPP + ppValues.accPP + ppValues.techPP);
	return isNaN(pp) ? 1024 : pp;
}

/**
 * https://github.com/BeatLeader/beatleader-server/blob/master/Utils/ReplayUtils.cs#L45
 * funky shit from ^
 *
 * @param {Number} accuracy the accuracy of the score
 * @param {Number} accRating the acc rating of the difficulty
 * @param {Number} passRating the pass rating of the difficulty
 * @param {Number} techRating the tech rating of the difficulty
 * @returns
 */
function getPP(accuracy, accRating, passRating, techRating) {
	let passPP = 15.2 * Math.exp(Math.pow(passRating, 1 / 2.62)) - 30;
	if (isNaN(passPP) || passPP == Infinity) {
		passPP = 0;
	}
	let accPP = curve(accuracy) * accRating * 34;
	let techPP = Math.exp(1.9 * accuracy) * techRating;

	return {
		passPP: passPP,
		accPP: accPP,
		techPP: techPP,
	};
}

/**
 * https://github.com/BeatLeader/beatleader-server/blob/master/Utils/ReplayUtils.cs#L45
 * funky shit from ^
 *
 * @param {Number} acc the accuracy of the score
 * @returns something
 */
function curve(acc) {
	let i = 0;
	for (; i < ppCurve.length; i++) {
		if (ppCurve[i][0] <= acc) {
			break;
		}
	}

	if (i == 0) {
		i = 1;
	}

	const middle_dis =
		(acc - ppCurve[i - 1][0]) / (ppCurve[i][0] - ppCurve[i - 1][0]);
	return ppCurve[i - 1][1] + middle_dis * (ppCurve[i][1] - ppCurve[i - 1][1]);
}

/**
 * https://github.com/BeatLeader/beatleader-server/blob/master/Utils/ReplayUtils.cs#L77
 * funky shit from ^
 *
 * @param {Number} peepee
 * @returns funny number, idk
 */
function inflate(peepee) {
	return (650 * Math.pow(peepee, 1.3)) / Math.pow(650, 1.3);
}
