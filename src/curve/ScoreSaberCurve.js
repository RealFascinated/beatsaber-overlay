// Yoinked from https://github.com/Shurdoof/pp-calculator/blob/c24b5ca452119339928831d74e6d603fb17fd5ef/src/lib/pp/calculator.ts
// Thank for for this I have no fucking idea what the maths is doing but it works!

const starMultiplier = 42.11;
const ppCurve = [
	[1, 7],
	[0.999, 6.24],
	[0.9975, 5.31],
	[0.995, 4.14],
	[0.9925, 3.31],
	[0.99, 2.73],
	[0.9875, 2.31],
	[0.985, 2.0],
	[0.9825, 1.775],
	[0.98, 1.625],
	[0.9775, 1.515],
	[0.975, 1.43],
	[0.9725, 1.36],
	[0.97, 1.3],
	[0.965, 1.195],
	[0.96, 1.115],
	[0.955, 1.05],
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

function clamp(value, min, max) {
	if (min !== null && value < min) {
		return min;
	}

	if (max !== null && value > max) {
		return max;
	}

	return value;
}

function lerp(v0, v1, t) {
	return v0 + t * (v1 - v0);
}

function calculatePPModifier(c1, c2, acc) {
	const distance = (c2[0] - acc) / (c2[0] - c1[0]);
	return lerp(c2[1], c1[1], distance);
}

function findPPModifier(acc, curve) {
	acc = clamp(acc, 0, 100) / 100;

	let prev = curve[1];
	for (const item of curve) {
		if (item[0] <= acc) {
			return calculatePPModifier(item, prev, acc);
		}
		prev = item;
	}
}

export function getScoreSaberPP(acc, stars) {
	const ppValue = stars * starMultiplier;
	const modifier = findPPModifier(acc, ppCurve);

	const finalPP = modifier * ppValue;
	return Number.isNaN(finalPP) ? undefined : finalPP;
}
