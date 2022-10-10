import {Component} from "react";

import styles from '../../styles/scoreStats.module.css';

export default class ScoreStats extends Component {

    constructor(params) {
        super(params);
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
        
        return <div className={styles.scoreStats}>
            <div className={styles.scoreStatsInfo}>
                <p>{data.percentage}</p>
                <p>{data.currentScore.toLocaleString()}</p>
            </div>
            <p className={styles.scoreStatsAverageCut}>Average Cut</p>
            <div className={styles.scoreStatsHands}>
                <div className={styles.scoreStatsLeft}>
                    <p>{this.getAverage(data.leftHand.averagePreSwing).toFixed(2)}</p>
                    <p>{this.getAverage(data.leftHand.averagePostSwing).toFixed(2)}</p>
                    <p>{this.getAverage(data.leftHand.averageCut).toFixed(2)}</p>
                </div>
                <div className={styles.scoreStatsRight}>
                    <p>{this.getAverage(data.rightHand.averagePreSwing).toFixed(2)}</p>
                    <p>{this.getAverage(data.rightHand.averagePostSwing).toFixed(2)}</p>
                    <p>{this.getAverage(data.rightHand.averageCut).toFixed(2)}</p>
                </div>
            </div>
        </div>
    }
}