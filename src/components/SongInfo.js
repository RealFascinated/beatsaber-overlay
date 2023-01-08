import Image from "next/image";
import { useSettingsStore } from "../store/overlaySettingsStore";
import { useSongDataStore } from "../store/songDataStore";

import styles from "../styles/songInfo.module.css";

/**
 * Format the given ms
 *
 * @param {Number} millis
 * @returns The formatted time
 */
function msToMinSeconds(millis) {
	const minutes = Math.floor(millis / 60000);
	const seconds = Number(((millis % 60000) / 1000).toFixed(0));
	return seconds === 60
		? minutes + 1 + ":00"
		: minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

/**
 * Update the difficulity color from the given difficulity
 *
 * @param {string} diff
 */
function formatDiff(diff) {
	if (diff === "ExpertPlus") {
		return "#8f48db";
	}
	if (diff === "Expert") {
		return "#bf2a42";
	}
	if (diff === "Hard") {
		return "tomato";
	}
	if (diff === "Normal") {
		return "#59b0f4";
	}
	if (diff === "Easy") {
		return "MediumSeaGreen";
	}
}

export default function SongInfo() {
	const [showSongInfo, shouldReplacePlayerInfoWithScore, songTimeHex] =
		useSettingsStore((store) => [
			store.showSongInfo,
			store.shouldReplacePlayerInfoWithScore,
			store.songTimeHex,
		]);
	const [
		isLoading,
		bsr,
		mapArt,
		songTitle,
		songSubTitle,
		songDifficulty,
		currentSongTime,
		songLength,
		paused,
	] = useSongDataStore((store) => [
		store.isLoading,
		store.bsr,
		store.mapArt,
		store.songTitle,
		store.songSubTitle,
		store.songDifficulty,
		store.currentSongTime,
		store.songLength,
		store.paused,
	]);

	if (!showSongInfo) {
		return null;
	}

	if (isLoading) {
		return null;
	}

	const songTimerPercentage = (currentSongTime / songLength) * 100000;
	const diffColor = formatDiff(songDifficulty);

	return (
		<div
			className={styles.songInfoContainer}
			style={{
				bottom: shouldReplacePlayerInfoWithScore ? "" : 0,
				left: shouldReplacePlayerInfoWithScore ? "" : 0,
				position: shouldReplacePlayerInfoWithScore ? "" : "fixed",
			}}
		>
			<Image
				width={150}
				height={150}
				alt="Song artwork"
				src={mapArt}
				loading="lazy"
				placeholder="blur"
				blurDataURL="https://cdn.fascinated.cc/yb4fgdc1.jpg"
				unoptimized
				style={{
					transition: "ease-in-out 100ms",
					filter: paused ? "grayscale(1)" : "",
				}}
			/>
			<div className={styles.songInfo}>
				<p className={styles.songInfoSongName}>
					{songTitle.length > 35
						? songTitle.substring(0, 35) + "..."
						: songTitle}
				</p>
				<p className={styles.songInfoSongSubName}>{songSubTitle}</p>
				<div className={styles.songInfoSongOtherContainer}>
					<p
						className={styles.songInfoDiff}
						style={{ backgroundColor: diffColor }}
					>
						{songDifficulty.replace("Plus", "+")}
					</p>
					<p className={styles.songInfoBsr}>!bsr {bsr}</p>
				</div>
				<p className={styles.songTimeText}>
					{msToMinSeconds(currentSongTime * 1000)}/{msToMinSeconds(songLength)}
				</p>
				<div className={styles.songTimeContainer}>
					<div className={styles.songTimeBackground} />
					<div
						className={styles.songTime}
						style={{
							width: songTimerPercentage + "%",
							backgroundColor: "#" + songTimeHex,
						}}
					/>
				</div>
			</div>
		</div>
	);
}
