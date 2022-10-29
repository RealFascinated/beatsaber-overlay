export function getMapHashFromLevelId(levelId: string): string {
	return levelId.replace("custom_level_", "");
}

/**
 * Formats the score.
 * eg: 91% = SS
 *
 * @param percent The percentage of the current score
 */
export function getFormattedScorePercent(percent: number): string {
	if (percent >= 90) {
		return "SS";
	}
	if (percent >= 80) {
		return "S";
	}
	if (percent >= 65) {
		return "A";
	}
	if (percent >= 50) {
		return "B";
	}
	if (percent >= 35) {
		return "C";
	}
	if (percent >= 20) {
		return "D";
	}
	return "E";
}
