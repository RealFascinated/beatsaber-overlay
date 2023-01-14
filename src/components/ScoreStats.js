import { getFormattedScorePercent } from "../helpers/map/mapHelpers";
import { useSettingsStore } from "../store/overlaySettingsStore";
import { useSongDataStore } from "../store/songDataStore";
import styles from "../styles/scoreStats.module.css";

export default function ScoreStats() {
	const [showScoreInfo, showPp] = useSettingsStore((store) => [
		store.showScoreInfo,
		store.showPp,
	]);
	const [percentage, currentScore, currentPP, combo, isLoading] =
		useSongDataStore((store) => [
			store.percentage,
			store.currentScore,
			store.currentPP,
			store.combo,
			store.isLoading,
		]);

	if (isLoading) {
		return null;
	}

	if (!showScoreInfo) {
		return null;
	}

	return (
		<div className={styles.scoreStats}>
			<p
				style={{
					fontSize: "45px",
				}}
			>
				{currentScore.toLocaleString("en-us", {
					maximumFractionDigits: 0,
					minimumFractionDigits: 0,
				})}
			</p>
			<div className={styles.scoreStatsInfo}>
				<div>
					<p>Combo: {combo}</p>
					<p>
						{getFormattedScorePercent(percentage)} {percentage.toFixed(2)}%
					</p>
					{currentPP !== undefined && showPp ? (
						<p>{currentPP.toFixed(0)}pp</p>
					) : null}
				</div>
			</div>
		</div>
	);
}
