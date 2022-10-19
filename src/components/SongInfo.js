import { Image } from "@nextui-org/react";
import { Component } from "react";

import styles from "../../styles/songInfo.module.css";

export default class SongInfo extends Component {
	constructor(params) {
		super(params);
		this.state = {
			diffColor: undefined,
		};
	}

	componentDidMount() {
		const data = this.props.data.songData.status.beatmap;
		this.formatDiff(data.difficulty);
	}

	/**
	 * Update the difficulity color from the given difficulity
	 *
	 * @param {string} diff
	 */
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

	/**
	 * Format the given ms
	 *
	 * @param {Number} millis
	 * @returns The formatted time
	 */
	msToMinSeconds(millis) {
		const minutes = Math.floor(millis / 60000);
		const seconds = Number(((millis % 60000) / 1000).toFixed(0));
		return seconds === 60
			? minutes + 1 + ":00"
			: minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
	}

	render() {
		const data = this.props.data.songData.status.beatmap;
		const beatSaverData = this.props.data.beatSaverData.data;
		const songArt = beatSaverData.songArt;
		const bsr = beatSaverData.bsr;
		const { songName, songAuthorName, difficulty } = data;
		// what in the fuck is this?? LMFAO
		const songTimerPercentage =
			(this.props.data.currentSongTime / 1000 / (data.length / 1000)) * 100000;

		return (
			<div className={styles.songInfoContainer}>
				<Image
					alt="Song art-work"
					src={songArt}
					loading="lazy"
					placeholder="blur"
					blurDataURL="https://cdn.fascinated.cc/IkQFyodbZv.jpg?raw=true"
					unoptimized={true}
				/>
				<div className={styles.songInfo}>
					<p className={styles.songInfoSongName}>
						{songName.length > 35
							? songName.substring(0, 35) + "..."
							: songName}
					</p>
					<p className={styles.songInfoSongAuthor}>{songAuthorName}</p>
					<div className={styles.songInfoSongOtherContainer}>
						<p
							className={styles.songInfoDiff}
							style={{ backgroundColor: this.state.diffColor }}
						>
							{difficulty}
						</p>
						<p className={styles.songInfoBsr}>!bsr {bsr}</p>
					</div>
					<p className={styles.songTimeText}>
						{this.msToMinSeconds(this.props.data.currentSongTime * 1000)}/
						{this.msToMinSeconds(data.length)}
					</p>
					<div className={styles.songTimeContainer}>
						<div className={styles.songTimeBackground} />
						<div
							className={styles.songTime}
							style={{ width: songTimerPercentage + "%" }}
						/>
					</div>
				</div>
			</div>
		);
	}
}
