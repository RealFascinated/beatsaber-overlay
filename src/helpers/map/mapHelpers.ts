export function getMapHashFromLevelId(levelId: string): string {
	return levelId.replace("custom_level_", "");
}
