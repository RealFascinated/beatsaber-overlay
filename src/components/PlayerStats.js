import ReactCountryFlag from "react-country-flag";
import { useDataStore } from "../store/overlayDataStore";
import { useSettingsStore } from "../store/overlaySettingsStore";
import { usePlayerDataStore } from "../store/playerDataStore";
import Avatar from "./Avatar";

import { Loading } from "@nextui-org/react";
import Image from "next/image";
import { useSongDataStore } from "../store/songDataStore";
import styles from "../styles/playerStats.module.css";

const PlayerStats = () => {
	const [showPlayerStats, shouldReplacePlayerInfoWithScore] = useSettingsStore(
		(store) => [store.showPlayerStats, store.shouldReplacePlayerInfoWithScore]
	);
	const inSong = useSongDataStore((state) => state.inSong);
	const [loadedDuringSong] = useDataStore((state) => [state.loadedDuringSong]);
	const [leaderboardType] = useSettingsStore((state) => [
		state.leaderboardType,
	]);
	const [isLoading, pp, avatar, globalPos, countryRank, country] =
		usePlayerDataStore((state) => [
			state.isLoading,
			state.pp,
			state.avatar,
			state.globalPos,
			state.countryRank,
			state.country,
		]);

	if (!showPlayerStats) {
		return null;
	}

	// Checks if we are in a song and should replace the player info with song info
	if (shouldReplacePlayerInfoWithScore && inSong) {
		return null;
	}

	if (isLoading) {
		return (
			<div className={styles.playerStatsContainer}>
				<Loading type="points" size="lg" />
			</div>
		);
	}

	return (
		<div className={styles.playerStatsContainer}>
			<div>
				<Avatar url={avatar} />
			</div>
			<div className={styles.playerStats}>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
					}}
				>
					<Image
						width={36}
						height={36}
						src={
							leaderboardType == "BeatLeader"
								? "https://cdn.fascinated.cc/l5KDPanV.png"
								: "https://cdn.fascinated.cc/Hc1eD7QY.png"
						}
						style={{
							marginLeft: "-3px",
						}}
						unoptimized
						alt="Player country icon"
					></Image>
					<p
						style={{
							marginLeft: "5px",
						}}
					>
						{pp.toLocaleString("en-us", {
							maximumFractionDigits: 2,
							minimumFractionDigits: 2,
						})}
						pp{" "}
					</p>
				</div>
				<p>
					#
					{globalPos.toLocaleString("en-us", {
						maximumFractionDigits: 0,
						minimumFractionDigits: 0,
					})}
				</p>
				<div className={styles.playerCountry}>
					<p>
						#
						{countryRank.toLocaleString("en-us", {
							maximumFractionDigits: 0,
							minimumFractionDigits: 0,
						})}
					</p>
					<ReactCountryFlag
						className={styles.playerCountryIcon}
						svg
						countryCode={country}
					/>
				</div>
				{loadedDuringSong ? (
					<>
						<p className={styles.connectedDuringSong}>
							Connected during song, some data
						</p>
						<p className={styles.connectedDuringSong}>
							may be incorrect for this song.
						</p>
					</>
				) : null}
			</div>
		</div>
	);
};

export default PlayerStats;
