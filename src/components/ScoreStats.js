import { Component } from "react";

import styles from "../styles/scoreStats.module.css";
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
			<div>
				<div className={styles.scoreStatsInfo}>
					<div className={styles.scoreStatsBig}>
						<p>{data.currentScore.toLocaleString()}</p>
					</div>
					<div className={styles.scoreStatsMed}>
						<p>{"Combo : " + data.combo.toLocaleString()}</p>
						<p>{data.rank + " " + data.percentage}</p>
						{currentPP !== undefined ? <p>{currentPP.toFixed(0)}pp</p> : null}
					</div>
				</div>
				<div className={styles.scoreStats}>
					<p className={styles.scoreStatsAverageCut}>Average Cut</p>
					<div className={styles.scoreStatsHands}>
						<div className={styles.scoreStatsLeft}>
							<p>{data.SaberA.averagePreSwing.toFixed(2)}</p>
							<p>{data.SaberA.averagePostSwing.toFixed(2)}</p>
							<p>{data.SaberA.cutDistanceScore.toFixed(2)}</p>
						</div>
						<div className={styles.scoreStatsRight}>
							<p>{data.SaberB.averagePreSwing.toFixed(2)}</p>
							<p>{data.SaberB.averagePostSwing.toFixed(2)}</p>
							<p>{data.SaberB.cutDistanceScore.toFixed(2)}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
