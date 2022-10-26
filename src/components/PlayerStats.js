import ReactCountryFlag from "react-country-flag";

import styles from "../styles/playerStats.module.css";
import Avatar from "./Avatar";

const PlayerStats = (props) => {
	return (
		<div className={styles.playerStatsContainer}>
			<div>
				<Avatar url={`https://cdn.scoresaber.com/avatars/${props.id}.jpg`} />
			</div>
			<div className={styles.playerStats}>
				<p>
					{props.pp}pp{" "}
					<span
						style={{
							fontSize: "23px",
						}}
					>
						({props.websiteType})
					</span>
				</p>
				<p>#{props.globalPos}</p>
				<div className={styles.playerCountry}>
					<p>#{props.countryRank}</p>
					<ReactCountryFlag
						className={styles.playerCountryIcon}
						svg
						countryCode={props.country}
					/>
				</div>
				{props.loadedDuringSong ? (
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
