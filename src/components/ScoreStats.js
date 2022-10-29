import { useSettingsStore } from "../store/overlaySettingsStore";
import { useSongDataStore } from "../store/songDataStore";
import styles from "../styles/scoreStats.module.css";

export default function ScoreStats() {
	const [showScoreInfo] = useSettingsStore((store) => [store.showScoreInfo]);
	const [percentage, currentScore, currentPP, saberA, saberB, isLoading] =
		useSongDataStore((store) => [
			store.percentage,
			store.currentScore,
			store.currentPP,
			store.saberA,
			store.saberB,
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
			<div className={styles.scoreStatsInfo}>
				<p>{percentage}</p>
				<p>
					{currentScore.toLocaleString("en-us", {
						maximumFractionDigits: 2,
						minimumFractionDigits: 2,
					})}
				</p>
				{currentPP !== undefined ? <p>{currentPP.toFixed(0)}pp</p> : null}
			</div>
			<p className={styles.scoreStatsAverageCut}>Average Cut</p>
			<div className={styles.scoreStatsHands}>
				<div className={styles.scoreStatsLeft}>
					<p>{saberA.averagePreSwing.toFixed(2)}</p>
					<p>{saberA.averagePostSwing.toFixed(2)}</p>
					<p>{saberA.cutDistanceScore.toFixed(2)}</p>
				</div>
				<div className={styles.scoreStatsRight}>
					<p>{saberB.averagePreSwing.toFixed(2)}</p>
					<p>{saberB.averagePostSwing.toFixed(2)}</p>
					<p>{saberB.cutDistanceScore.toFixed(2)}</p>
				</div>
			</div>
		</div>
	);
}
