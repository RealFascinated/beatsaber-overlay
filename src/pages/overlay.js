import axios from "axios";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
import CutStats from "../components/CutStats";
import PlayerStats from "../components/PlayerStats";
import ScoreStats from "../components/ScoreStats";
import SongInfo from "../components/SongInfo";
import { connectClient } from "../helpers/websocketClient";
import { useSettingsStore } from "../store/overlaySettingsStore";
import { usePlayerDataStore } from "../store/playerDataStore";

import styles from "../styles/overlay.module.css";

export default function Overlay(props) {
	const query = JSON.parse(props.query);
	const [setOverlaySettings, mounted, setMounted] = useSettingsStore(
		(state) => [state.setOverlaySettings, state.mounted, state.setMounted]
	);
	const updatePlayerData = usePlayerDataStore(
		(state) => state.updatePlayerData
	);

	useEffect(() => {
		if (!mounted && props.isValidSteamId) {
			setMounted(true);

			async function setup() {
				await setOverlaySettings(query);
				const showSongInfo = useSettingsStore.getState().showSongInfo;
				const showScoreInfo = useSettingsStore.getState().showScoreInfo;
				if (showSongInfo || (showScoreInfo && typeof window !== "undefined")) {
					await connectClient();
				}
				const showPlayerStats = useSettingsStore.getState().showPlayerStats;
				if (showPlayerStats) {
					await updatePlayerData();
				}
			}
			setup();
		}
	}, [
		query,
		props.isValidSteamId,
		setOverlaySettings,
		mounted,
		setMounted,
		updatePlayerData,
	]);

	if (!props.isValidSteamId) {
		return (
			<div className={styles.invalidPlayer}>
				<h1>Invalid Steam ID</h1>
				<h3>Please check the id field in the url</h3>
			</div>
		);
	}

	return (
		<div className={styles.main}>
			<NextSeo title="Overlay"></NextSeo>
			<PlayerStats />
			<CutStats />
			<ScoreStats />
			<SongInfo />
		</div>
	);
}

export async function getServerSideProps(context) {
	const steamId = context.query.id;
	const steamIdResponse = await axios.get(
		`${process.env.REACT_APP_SITE_URL}/api/validateid?steamid=${steamId}`
	);

	return {
		props: {
			isValidSteamId: steamIdResponse.data.message === "Valid",
			query: JSON.stringify(context.query),
		},
	};
}
