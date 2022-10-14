import ReactCountryFlag from "react-country-flag";

import styles from "../../styles/playerStats.module.css";
import Avatar from "./Avatar";

const PlayerStats = (props) => {
	return (
		<div className={styles.playerStatsContainer}>
			<div>
				<Avatar url={props.avatar} />
			</div>
			<div className={styles.playerStats}>
				<p>
					{props.pp}pp{" "}
					<span
						style={{
							fontSize: "20px",
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
			</div>
		</div>
	);
};

export default PlayerStats;
