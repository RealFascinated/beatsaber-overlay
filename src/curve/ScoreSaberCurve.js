// Yoinked from https://github.com/Shurdoof/pp-calculator/blob/c24b5ca452119339928831d74e6d603fb17fd5ef/src/lib/pp/calculator.ts
// Thank for for this I have no fucking idea what the maths is doing but it works!
export default class ScoreSaberCurve {
	static starMultiplier = 42.11;
	static ppCurve = [
		[1, 7],
		[0.999, 5.8],
		[0.9975, 4.7],
		[0.995, 3.76],
		[0.9925, 3.17],
		[0.99, 2.73],
		[0.9875, 2.38],
		[0.985, 2.1],
		[0.9825, 1.88],
		[0.98, 1.71],
		[0.9775, 1.57],
		[0.975, 1.45],
		[0.9725, 1.37],
		[0.97, 1.31],
		[0.965, 1.2],
		[0.96, 1.11],
		[0.955, 1.045],
		[0.95, 1],
		[0.94, 0.94],
		[0.93, 0.885],
		[0.92, 0.835],
		[0.91, 0.79],
		[0.9, 0.75],
		[0.875, 0.655],
		[0.85, 0.57],
		[0.825, 0.51],
		[0.8, 0.47],
		[0.75, 0.4],
		[0.7, 0.34],
		[0.65, 0.29],
		[0.6, 0.25],
		[0.0, 0.0],
	];

	static clamp(value, min, max) {
		if (min !== null && value < min) {
			return min;
		}

		if (max !== null && value > max) {
			return max;
		}

		return value;
	}

	static lerp(v0, v1, t) {
		return v0 + t * (v1 - v0);
	}

	static calculatePPModifier(c1, c2, acc) {
		const distance = (c2[0] - acc) / (c2[0] - c1[0]);
		return ScoreSaberCurve.lerp(c2[1], c1[1], distance);
	}

	static findPPModifier(acc, curve) {
		acc = ScoreSaberCurve.clamp(acc, 0, 100) / 100;

		let prev = curve[1];
		for (const item of curve) {
			if (item[0] <= acc) {
				return ScoreSaberCurve.calculatePPModifier(item, prev, acc);
			}
			prev = item;
		}
	}

	static getPP(acc, stars) {
		const ppValue = stars * ScoreSaberCurve.starMultiplier;
		const modifier = ScoreSaberCurve.findPPModifier(
			acc,
			ScoreSaberCurve.ppCurve
		);

		const finalPP = modifier * ppValue;
		return Number.isNaN(finalPP) ? undefined : finalPP;
	}
}
