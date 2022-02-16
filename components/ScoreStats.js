import {Component} from "react";

export default class ScoreStats extends Component {

    constructor(params) {
        super(params);

        this.state = {
            socket: undefined,
            isVisible: true,
            currentScore: 0,
            percentage: "100.00%",
            failed: false,
            leftHand: {
                averageCut: [15.00],
                averagePreSwing: [70.00],
                averagePostSwing: [30.00],
            },
            rightHand: {
                averageCut: [15.00],
                averagePreSwing: [70.00],
                averagePostSwing: [30.00],
            }
        }
    }

    connectSocket() {
        const socket = new WebSocket('ws://localhost:6557/socket');
        socket.addEventListener('error' || 'close', () => {
            console.log("Attempting to re-connect to the HTTP Status socket in 30 seconds.");
            setTimeout(() => this.connectSocket(), 30_000);
        });
        socket.addEventListener('message', (message) => {
            const json = JSON.parse(message.data);
            if (!this.handlers[json.event]) {
                console.log("Unhandled message from HTTP Status. (" + json.event + ")");
                return;
            }
            this.handlers[json.event](json || []);
        })
        this.setState({ socket: socket });
    }

    resetData(visible) {
        console.log("Exiting level, resetting data.")
        this.setState({
            "leftHand": {
                "averageCut": [15.00],
                "averagePreSwing": [70.00],
                "averagePostSwing": [30.00],
            },
            "rightHand": {
                "averageCut": [15.00],
                "averagePreSwing": [70.00],
                "averagePostSwing": [30.00],
            },
            currentScore: 0,
            percentage: "100.00%",
            isVisible: visible
        });
    }

    handlers = {
        "hello": () => {
            console.log("Hello from HTTP Status!");
        },
        "scoreChanged": (data) => {
            const { status } = data;
            const { score, currentMaxScore } = status.performance;
            const percent = currentMaxScore > 0 ? ((score / currentMaxScore) * 1000 / 10).toFixed(2) : 0.00;
            this.setState({
                    currentScore: score,
                    percentage: this.state.failed ? percent * 2 : percent + "%"
            })
        },
        "noteFullyCut": (data) => {
            const { noteCut } = data;

            // Left Saber
            if (noteCut.saberType === 'SaberA') {
                const data = this.state.leftHand;
                if (data.averageCut.includes(15) && data.averageCut.length === 1) {
                    data.averageCut = [];
                }
                if (data.averagePreSwing.includes(70) && data.averagePreSwing.length === 1) {
                    data.averagePreSwing = [];
                }
                if (data.averagePostSwing.includes(30) && data.averagePostSwing.length === 1) {
                    data.averagePostSwing = [];
                }
                data.averagePreSwing.push(noteCut.initialScore > 70 ? 70 : noteCut.initialScore);
                data.averagePostSwing.push(noteCut.finalScore - noteCut.initialScore);
                data.averageCut.push(noteCut.cutDistanceScore);
                this.setState({ leftHand: data });
            }

            // Left Saber
            if (noteCut.saberType === 'SaberB') {
                const data = this.state.rightHand;
                if (data.averageCut.includes(15) && data.averageCut.length === 1) {
                    data.averageCut = [];
                }
                if (data.averagePreSwing.includes(70) && data.averagePreSwing.length === 1) {
                    data.averagePreSwing = [];
                }
                if (data.averagePostSwing.includes(30) && data.averagePostSwing.length === 1) {
                    data.averagePostSwing = [];
                }
                data.averagePreSwing.push(noteCut.initialScore > 70 ? 70 : noteCut.initialScore);
                data.averagePostSwing.push(noteCut.finalScore - noteCut.initialScore);
                data.averageCut.push(noteCut.cutDistanceScore);
                this.setState({ rightHand: data });
            }
        },
        "songStart": () => {
            console.log("Going into level, resetting data.")
            this.resetData(true);
        },
        "finished": () => {
            console.log("Exiting level, resetting data.")
            this.resetData(false);
        },
        "softFail": () => {
            this.setState({ failed: true });
        },
        "menu": () => {},
        "noteCut": () => {},
        "noteMissed": () => {},
        "noteSpawned": () => {},
        "bombMissed": () => {},
        "beatmapEvent": () => {}
    }

    componentDidMount() {
        this.connectSocket();
    }

    getAverage(values) {
        return values.reduce((p, c) => p + c, 0) / values.length;
    }

    render() {
        return <div className={'score-stats'} style={{ display: this.state.isVisible ? "block" : "none" }}>
            <p className={'score-stats-average-cut'}>Average Cut</p>
            <div className={'score-stats-hands'}>
                <div className={'score-stats-left'}>
                    <p>{this.getAverage(this.state.leftHand.averagePreSwing).toFixed(2)}</p>
                    <p>{this.getAverage(this.state.leftHand.averagePostSwing).toFixed(2)}</p>
                    <p>{this.getAverage(this.state.leftHand.averageCut).toFixed(2)}</p>
                </div>
                <div className={'score-stats-right'}>
                    <p>{this.getAverage(this.state.rightHand.averagePreSwing).toFixed(2)}</p>
                    <p>{this.getAverage(this.state.rightHand.averagePostSwing).toFixed(2)}</p>
                    <p>{this.getAverage(this.state.rightHand.averageCut).toFixed(2)}</p>
                </div>
            </div>

            <div className={'score-stats-info'}>
                <p>{this.state.percentage}</p>
                <p>{this.state.currentScore.toLocaleString()}</p>
            </div>
        </div>
    }
}