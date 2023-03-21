/**
 * I'm not even sure what this shit does, ask BL
 * @see https://github.com/BeatLeader/beatleader-server/blob/16123a792b1a837faf6287e5bcd58e2e06e6a6f0/Utils/ReplayUtils.cs for more info
 *
 * @param {Number} acc the accuracy of the score
 * @param {Number} stars the ranked star count
 * @returns
 */
function curve(acc, stars) {
	var l = 1 - (0.03 * (stars - 3.0)) / 11.0;
	var a = 0.96 * l;
	var f = 1.2 - (0.6 * stars) / 14.0;
	return Math.pow(Math.log10(l / (l - acc)) / Math.log10(l / (l - a)), f);
}

/**
 * Gets the raw pp from the given score
 *
 * @param {Number} acc the accuracy of the score
 * @param {Number} stars the ranked star count
 * @returns
 */
export function getBeatLeaderPP(acc, stars) {
	if (stars === undefined || acc === undefined) {
		return undefined;
	}
	const pp = curve(acc, stars - 0.5) * (stars + 0.5) * 42;

	const isNegativeAcc = acc < 0;
	if (isNegativeAcc) {
		acc *= -1;
	}

	if (pp == NaN || pp == Infinity) {
		return 1024;
	}

	if (isNegativeAcc) {
		pp *= -1;
	}

	return pp;
}
