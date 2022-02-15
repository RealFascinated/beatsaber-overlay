import {Component, useState} from "react";

export default class ScoreStats extends Component {

    constructor(params) {
        super(params);

        this.state = {
            score: 0,
            dataSocket: undefined,
            isVisible: false,
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

    componentDidMount() {
        const socket = new WebSocket('ws://localhost:6557/socket');
        this.setState({ socket: socket });
        socket.addEventListener('error' || 'close', () => {
            console.log("Attempting to re-connect to the HTTP Status socket.");
            this.setState({ socket: new WebSocket('ws://localhost:6557/socket') });
        });
        socket.addEventListener('message', (message) => {
            //console.log("Received message from HTTP Status.");
            const json = JSON.parse(message.data);
            if (!handlers[json.event]) {
                console.log("Unhandled message from HTTP Status. (" + json.event + ")");
                return;
            }
            handlers[json.event](json || []);
        })

        const handlers = {
            "hello": () => {
                console.log("Hello from HTTP Status!");
            },
            "scoreChanged": (data) => {
                const { status } = data;
                this.setState({ score: status.performance.score })
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
            "menu": () => {
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
                    isVisible: false
                });
            },
            "songStart": () => {
                console.log("Going into level, resetting data.")
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
                    isVisible: true
                });
            },
            "noteCut": () => {},
            "noteMissed": () => {},
            "noteSpawned": () => {},
            "bombMissed": () => {},
            "beatmapEvent": () => {}
        }
    }

    getAverage(values) {
        return values.reduce( ( p, c ) => p + c, 0 ) / values.length;
    }

    render() {
        return <div className={'score-stats'} style={{ display: this.state.isVisible ? "block" : "none" }}>
            <p>{this.state.score.toLocaleString()}</p>
            <div className={'score-stats-hands'}>
                <div>
                    <p>{this.getAverage(this.state.leftHand.averagePreSwing).toFixed(2)}</p>
                    <p>{this.getAverage(this.state.leftHand.averagePostSwing).toFixed(2)}</p>
                    <p>{this.getAverage(this.state.leftHand.averageCut).toFixed(2)}</p>
                </div>
                <div>
                    <p>{this.getAverage(this.state.rightHand.averagePreSwing).toFixed(2)}</p>
                    <p>{this.getAverage(this.state.rightHand.averagePostSwing).toFixed(2)}</p>
                    <p>{this.getAverage(this.state.rightHand.averageCut).toFixed(2)}</p>
                </div>
            </div>
        </div>
    }
}