import Head from 'next/head'
import { Component } from 'react'
import Avatar from '../components/Avatar';
import PlayerStats from '../components/PlayerStats';

// Why do u have to proxy requests... it's so dumb LOL
const API_URL = "https://bangor375.herokuapp.com/https://scoresaber.com/api/player/%s/full";
const GUTHUB_URL = "https://github.com/RealFascinated/beatsaber-overlay";

export default class Home extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			id: undefined,
			isValidScoresaber: true,
			data: undefined
		}
	}

	async componentDidMount() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());

		const id = params.id;
		if (!id) { // Check if the id pararm is valid
			this.setState({ loading: false, isValidScoresaber: false });
			return;
		}

		await this.updateData(id);
		setTimeout(async () => {
			if (!this.state.isValidScoresaber) {
				return;
			}
			await this.updateData(id);
		}, 30_000); // Update the scoresaber data every 30 seconds.
	}

	async updateData(id) {
		const data = await fetch(API_URL.replace("%s", id), {
			mode: 'cors'
		});
		if (data.status == 422) { // invalid scoresaber
			this.setState({ loading: false, isValidScoresaber: false });
			return;
		}
		const json = await data.json();
		if (json.errorMessage) {
			this.setState({ loading: false, isValidScoresaber: false });
			return;
		}
		this.setState({ loading: false, id: id, data: json });
		console.log(json);
	}

	render() {
		const { loading, isValidScoresaber, data } = this.state;

		if (!isValidScoresaber && !loading) {
			const body = document.body;
			body.style.backgroundColor = "#181a1b";
		}

		return <>
			{ loading ? 
			<div className={'loading'}>
				<h2>Loading...</h2>
			</div>
			: !isValidScoresaber ? 
			<div className={'invalid-player'}>
				<p>Provide a valid scoresaber id</p>
				<p>Example: {document.location.origin}?id=76561198449412074</p>
				<div className={'info'}>
					<p>This is currently just a simple overlay for OBS displaying ScoreSaber stats.</p>
					<p>If you have any suggestions you can message me on discord @ Fascinated#4719</p>
					<div className={'info'}>
						<p>If you use this overlay and like it, don&apos;t forget to star the project :3</p>
						<p>Github link: <span><a href={GUTHUB_URL}>{GUTHUB_URL}</a></span></p>
					</div>
				</div>
			</div> :
			<div className={'overlay'}>
				<div className={'player-stats-container'}>
					<Avatar url={data.profilePicture} />
					<PlayerStats
						pp={data.pp.toLocaleString()}
						globalPos={data.rank.toLocaleString()}
						country={data.country}
						countryRank={data.countryRank.toLocaleString()}
					/>
				</div>
			</div>
			}
		</>
	}
}