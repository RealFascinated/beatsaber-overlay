import { Component } from "react";

import styles from "../styles/timingStats.module.css";

export default class TimingStats extends Component {
	render() {
		const data = this.props.data;

		return (
			<div className={styles.timingStats}>
				<p className={styles.timingStatsTiming}>Time Deviation</p>
				<div className={styles.timingStatsHands}>
					<div className={styles.timingStatsLeft}>
						<p>{data.SaberA.averageTiming.toFixed(0)}</p>
						<p>{data.SaberA.timing.toFixed(0)}</p>
					</div>
					<div className={styles.timingStatsRight}>
						<p>{data.SaberB.averageTiming.toFixed(0)}</p>
						<p>{data.SaberB.timing.toFixed(0)}</p>
					</div>
				</div>
			</div>
		);
	}
}
