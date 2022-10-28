import { Component } from "react";

import styles from "../styles/speedStats.module.css";

export default class SpeedStats extends Component {
	render() {
		const data = this.props.data;

		return (
			<div className={styles.speedStats}>
				<p className={styles.speedStatsSpeed}>Cut Speed</p>
				<div className={styles.speedStatsHands}>
					<div className={styles.speedStatsLeft}>
						<p>{data.SaberA.averageSpeed.toFixed(0)}</p>
						<p>{data.SaberA.speed.toFixed(0)}</p>
					</div>
					<div className={styles.speedStatsRight}>
						<p>{data.SaberB.averageSpeed.toFixed(0)}</p>
						<p>{data.SaberB.speed.toFixed(0)}</p>
					</div>
				</div>
			</div>
		);
	}
}
