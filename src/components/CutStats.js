import { useSettingsStore } from "../store/overlaySettingsStore";
import { useSongDataStore } from "../store/songDataStore";
import styles from "../styles/cutStats.module.css";

export default function CutStats() {
	const [showScoreInfo] = useSettingsStore((store) => [store.showScoreInfo]);
	const [saberA, saberB, isLoading] = useSongDataStore((store) => [
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
		<div className={styles.cutStats}>
			<p className={styles.cutStatsAverageCut}>Average Cut</p>
			<div className={styles.cutStatsHands}>
				<div className={styles.cutStatsLeft}>
					<p>{saberA.averagePreSwing.toFixed(2)}</p>
					<p>{saberA.averagePostSwing.toFixed(2)}</p>
					<p>{saberA.cutDistanceScore.toFixed(2)}</p>
				</div>
				<div className={styles.cutStatsRight}>
					<p>{saberB.averagePreSwing.toFixed(2)}</p>
					<p>{saberB.averagePostSwing.toFixed(2)}</p>
					<p>{saberB.cutDistanceScore.toFixed(2)}</p>
				</div>
			</div>
		</div>
	);
}
