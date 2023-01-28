import Image from "next/image";
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

	const scoreSaberPP = currentPP?.scoreSaber;
	const beatLeaderPP = currentPP?.beatLeader;

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
					{scoreSaberPP !== undefined && showPp ? (
						<div
							style={{
								display: "flex",
								flexDirection: "row",
							}}
						>
							<Image
								width={30}
								height={30}
								src="https://cdn.fascinated.cc/Hc1eD7QY.png"
							></Image>
							<p
								style={{
									marginLeft: "5px",
								}}
							>
								{scoreSaberPP.toFixed(0)}pp
							</p>
						</div>
					) : null}
					{beatLeaderPP !== undefined && showPp ? (
						<div
							style={{
								display: "flex",
								flexDirection: "row",
							}}
						>
							<Image
								width={30}
								height={30}
								src="https://cdn.fascinated.cc/Wo9JRAfD.png"
							></Image>
							<p
								style={{
									marginLeft: "8px",
								}}
							>
								{beatLeaderPP.toFixed(0)}pp
							</p>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
