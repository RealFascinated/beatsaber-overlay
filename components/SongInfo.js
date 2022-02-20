import {Component} from "react";
import Image from 'next/image'
import Config from "../config.json";

export default class SongInfo extends Component {

    constructor(params) {
        super(params);
        this.state = {
            diffColor: undefined
        }
    }

    componentDidMount() {
        const data = this.props.data.songData.status.beatmap;
        this.formatDiff(data.difficulty);
    }

    formatDiff(diff) {
        if (diff === "Expert+") {
            this.setState({ diffColor: "#8f48db" });
        }
        if (diff === "Expert") {
            this.setState({ diffColor: "#bf2a42" });
        }
        if (diff === "Hard") {
            this.setState({ diffColor: "tomato" });
        }
        if (diff === "Normal") {
            this.setState({ diffColor: "#59b0f4" });
        }
        if (diff === "Easy") {
            this.setState({ diffColor: "MediumSeaGreen" });
        }
    }

    msToMinSeconds(millis) {
        const minutes = Math.floor(millis / 60000);
        const seconds = Number(((millis % 60000) / 1000).toFixed(0));
        return seconds === 60 ? minutes + 1 + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    render() {
        const data = this.props.data.songData.status.beatmap;
        const beatSaverData = this.props.data.beatSaverData.data;
        const songArt = beatSaverData.songArt;
        const bsr = beatSaverData.bsr;
        const {
            songName,
            songAuthorName,
            difficulty
        } = data
        const songTimerPercentage = ((this.props.data.currentSongTime / 1000) / (data.length / 1000)) * 100000;

        return <div className={'song-info-container'}>
            <img src={songArt}/>
            <div className={'song-info'}>
                <p className={'song-info-song-name'}>{songName}</p>
                <p className={'song-info-song-author'}>{songAuthorName}</p>
                <div className={'song-info-song-other-container'}>
                    <p className={'song-info-diff'} style={{ backgroundColor: this.state.diffColor }}>{difficulty}</p>
                    <p className={'song-info-bsr'}>!bsr {bsr}</p>
                </div>
                <p className={'song-time-text'}>Song Time | {this.msToMinSeconds(this.props.data.currentSongTime * 1000)}/{this.msToMinSeconds(data.length)}</p>
                <div className={'song-time-container'}>
                    <div className={'song-time-background'}/>
                    <div className={'song-time'} style={{ width: songTimerPercentage + '%' }}/>
                </div>
            </div>
        </div>
    }
}