import Image from "next/image";
import { getFormattedScorePercent } from "../helpers/map/mapHelpers";
import { useSettingsStore } from "../store/overlaySettingsStore";
import { useSongDataStore } from "../store/songDataStore";
import styles from "../styles/scoreStats.module.css";
import Utils from "../utils/utils";

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
					{scoreSaberPP !== undefined &&
					scoreSaberPP.pp !== undefined &&
					showPp ? (
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
								unoptimized
								alt="BeatLeader logo"
							></Image>
							<p
								style={{
									marginLeft: "5px",
								}}
							>
								{scoreSaberPP.pp.toFixed(0)}pp
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
								unoptimized
								alt="BeatLeader logo"
							></Image>
							<div>
								{Object.entries(beatLeaderPP).map((value, i) => {
									let name = value[0];
									const pp = value[1];

									name = name.split("PP")[0];
									if (name == "pp") {
										name = undefined;
									}
									if (name !== undefined) {
										name = Utils.capitalizeFirstLetter(name);
									}

									return (
										<p
											key={i}
											style={{
												marginLeft: "8px",
												fontSize: name == undefined ? "35px" : "30px",
											}}
										>
											{name} {pp.toFixed(0)}pp
										</p>
									);
								})}
							</div>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
