function curve(acc, stars) {
	var l = 1 - (0.03 * (stars - 3.0)) / 11.0;
	var a = 0.96 * l;
	var f = 1.2 - (0.6 * stars) / 14.0;

	return Math.pow(Math.log10(l / (l - acc)) / Math.log10(l / (l - a)), f);
}

export function getBeatLeaderPP(acc, stars) {
	if (stars === undefined || acc === undefined) {
		return undefined;
	}
	const pp = curve(acc / 100, stars - 0.5) * (stars + 0.5) * 42;
	return Number.isNaN(pp) ? undefined : pp;
}
