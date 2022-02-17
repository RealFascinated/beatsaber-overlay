import {Component} from "react";

export default class ScoreStats extends Component {

    constructor(params) {
        super(params);
    }

    getAverage(values) {
        return values.reduce((p, c) => p + c, 0) / values.length;
    }

    render() {
        const data = this.props.data;
        
        return <div className={'score-stats'}>
            <p className={'score-stats-average-cut'}>Average Cut</p>
            <div className={'score-stats-hands'}>
                <div className={'score-stats-left'}>
                    <p>{this.getAverage(data.leftHand.averagePreSwing).toFixed(2)}</p>
                    <p>{this.getAverage(data.leftHand.averagePostSwing).toFixed(2)}</p>
                    <p>{this.getAverage(data.leftHand.averageCut).toFixed(2)}</p>
                </div>
                <div className={'score-stats-right'}>
                    <p>{this.getAverage(data.rightHand.averagePreSwing).toFixed(2)}</p>
                    <p>{this.getAverage(data.rightHand.averagePostSwing).toFixed(2)}</p>
                    <p>{this.getAverage(data.rightHand.averageCut).toFixed(2)}</p>
                </div>
            </div>

            <div className={'score-stats-info'}>
                <p>{data.percentage}</p>
                <p>{data.currentScore.toLocaleString()}</p>
            </div>
        </div>
    }
}