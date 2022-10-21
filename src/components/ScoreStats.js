import { Component } from "react";

import styles from "../../styles/scoreStats.module.css";
import Utils from "../utils/utils";

export default class ScoreStats extends Component {
	constructor(params) {
		super(params);
		this.lastKnownPP = undefined;
	}

	/**
	 * Returns the average of the provided numbers list
	 *
	 * @param {List<Number>} hitValues
	 * @returns The average value
	 */
	getAverage(hitValues) {
		return hitValues.reduce((p, c) => p + c, 0) / hitValues.length;
	}

	render() {
		const data = this.props.data;
		let currentPP = Utils.calculatePP(
			data.mapStarCount,
			data.percentage.replace("%", ""),
			data.websiteType
		);
		if (this.lastKnownPP === undefined) {
			this.lastKnownPP = currentPP;
		}
		if (currentPP === undefined) {
			currentPP = this.lastKnownPP;
		}
		this.lastKnownPP = currentPP;

		return (
			<div className={styles.scoreStats}>
				<div className={styles.scoreStatsInfo}>
					<p>{data.percentage}</p>
					<p>{data.currentScore.toLocaleString()}</p>
					{currentPP !== undefined ? <p>{currentPP.toFixed(0)}pp</p> : null}
				</div>
				<p className={styles.scoreStatsAverageCut}>Average Cut</p>
				<div className={styles.scoreStatsHands}>
					<div className={styles.scoreStatsLeft}>
						<p>{this.getAverage(data.SaberA.averagePreSwing).toFixed(2)}</p>
						<p>{this.getAverage(data.SaberA.averagePostSwing).toFixed(2)}</p>
						<p>{this.getAverage(data.SaberA.averageCut).toFixed(2)}</p>
					</div>
					<div className={styles.scoreStatsRight}>
						<p>{this.getAverage(data.SaberB.averagePreSwing).toFixed(2)}</p>
						<p>{this.getAverage(data.SaberB.averagePostSwing).toFixed(2)}</p>
						<p>{this.getAverage(data.SaberB.averageCut).toFixed(2)}</p>
					</div>
				</div>
			</div>
		);
	}
}
