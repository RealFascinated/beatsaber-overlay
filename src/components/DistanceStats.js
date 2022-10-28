import { Component } from "react";

import styles from "../styles/distanceStats.module.css";

export default class DistanceStats extends Component {
	render() {
		const data = this.props.data;

		return (
			<div className={styles.distanceStats}>
				<p className={styles.distanceStatsdistance}>Dist. To Center</p>
				<div className={styles.distanceStatsHands}>
					<div className={styles.distanceStatsLeft}>
						<p>{data.SaberA.averageDistanceToCenter.toFixed(0)}</p>
						<p>{data.SaberA.distanceToCenter.toFixed(0)}</p>
					</div>
					<div className={styles.distanceStatsRight}>
						<p>{data.SaberB.averageDistanceToCenter.toFixed(0)}</p>
						<p>{data.SaberB.distanceToCenter.toFixed(0)}</p>
					</div>
				</div>
			</div>
		);
	}
}
