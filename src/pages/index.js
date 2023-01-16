import {
	Button,
	Card,
	Container,
	Grid,
	Input,
	Link,
	Radio,
	Spacer,
	Spinner,
	Switch,
	Text,
} from "@nextui-org/react";
import { Component } from "react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { NextSeo } from "next-seo";
import NavBar from "../components/Navbar";
import styles from "../styles/main.module.css";

export default class Home extends Component {
	constructor(props) {
		super(props);

		this._mounted = false;
		this.state = {
			loading: true,
			steamId: undefined,
			overlayUrl: undefined,
			avatarUrl: undefined,

			values: {
				socketAddr: undefined,
				leaderboardType: "ScoreSaber",
				showPlayerStats: true,
				showScoreInfo: false,
				showSongInfo: false,
				showCutStats: false,
				shouldReplacePlayerInfoWithScore: false,
				showPp: true,
			},
		};
	}

	async componentDidMount() {
		if (this._mounted === true) {
			return;
		}
		this._mounted = true;

		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());

		if (params.id) {
			document.location.href = "/overlay/" + window.location.search;
			return;
		}

		if (localStorage.getItem("values") == undefined) {
			localStorage.setItem(
				"values",
				JSON.stringify({
					steamId: this.state.steamId,
					values: this.state.values,
				})
			);
		} else {
			const json = JSON.parse(localStorage.getItem("values"));
			let values = {};
			Object.entries(json.values).forEach((value) => {
				if (
					value[0] !== undefined &&
					this.state.values[value[0]] !== undefined
				) {
					values[value[0]] = value[1];
				}
			});

			this.setState({ steamId: json.steamId, values: values });
			this.validateSteamId(json.steamId || "");
		}
		this.setState({ loading: false });
	}

	generateUrl() {
		let values = "";
		Object.entries(this.state.values).forEach((value) => {
			if (value[1] === undefined) {
				return;
			}
			values += `&${value[0]}=${value[1]}`;
		});

		return (
			window.location.origin + "/overlay?id=" + this.state.steamId + values
		);
	}

	updateValue(key, value) {
		let values = this.state.values;
		values[key] = value;
		this.setState({ values: values });
		this.updateStorage();
	}

	updateStorage() {
		setTimeout(() => {
			localStorage.setItem(
				"values",
				JSON.stringify({
					steamId: this.state.steamId,
					values: this.state.values,
				})
			);
		}, 5);
	}

	async validateSteamId(steamId) {
		if (steamId.length !== 17) {
			// Steam ID is invalid
			return this.setState({ avatarUrl: undefined });
		}

		const response = await axios.get("/api/validateid?steamid=" + steamId);
		const json = response.data;

		if (json.message === "Valid") {
			this.setState({
				avatarUrl: `https://cdn.scoresaber.com/avatars/${steamId}.jpg`,
			});
		} else {
			this.setState({ avatarUrl: undefined });
		}
	}

	render() {
		return this.state.loading ? (
			<div className={styles.loading}>
				<Spinner size={"xl"}></Spinner>
			</div>
		) : (
			<div className={styles.main}>
				<NavBar avatarUrl={this.state.avatarUrl}></NavBar>

				<NextSeo title="Builder"></NextSeo>

				<Container
					css={{
						marginTop: "$8",
					}}
				>
					<Grid.Container gap={2} justify="center">
						<Grid
							xs={12}
							css={{
								color: "black",
							}}
							justify="center"
						>
							<Container md>
								<div
									style={{
										textAlign: "center",
									}}
								>
									<Text h1 css={{ color: "$text" }}>
										Overlay Builder
									</Text>
									<Text
										p
										css={{
											color: "$text",
											marginTop: "-15px",
											fontSize: "23px",
										}}
									>
										Elevate your Beat Saber streams with our overlay builder.
										Customize and enhance your streams with real-time scores,
										rankings, and leaderboard information. Stand out and attract
										more viewers with our easy to use overlay builder for
										ScoreSaber and BeatLeader!
									</Text>
								</div>
							</Container>
						</Grid>

						<Grid xs={12} lg={9}>
							<Card>
								<Card.Body>
									<Spacer y={1.2} />

									<Input
										underlined
										labelPlaceholder="Ip Address (Only set if you stream on multiple devices)"
										initialValue="localhost"
										value={this.state.values.socketAddr}
										onChange={(event) =>
											this.updateValue("socketAddr", event.target.value)
										}
										checked={true}
									/>
									<Spacer y={2} />
									<Input
										underlined
										labelPlaceholder="Steam Id (NOT Username)"
										initialValue=""
										value={this.state.steamId}
										onChange={async (event) => {
											const id = event.target.value;
											await this.validateSteamId(id);
											this.setState({ steamId: id });
											this.updateStorage();
										}}
									/>
									<Spacer y={1} />
									<Text>Ranked leaderboard</Text>
									<Radio.Group
										defaultValue={
											this.state.values.leaderboardType || "ScoreSaber"
										}
										onChange={(value) => {
											this.updateValue("leaderboardType", value);
										}}
									>
										<Radio
											value="ScoreSaber"
											description="Uses the leaderboard from https://scoresaber.com/"
											size="sm"
										>
											ScoreSaber
										</Radio>
										<Radio
											value="BeatLeader"
											description="Uses the leaderboard from https://www.beatleader.xyz/"
											size="sm"
										>
											BeatLeader
										</Radio>
									</Radio.Group>
									<Spacer y={1} />
									<Text>Show player stats (Current PP, global pos, etc)</Text>
									<Switch
										label="Ranked leaderboard"
										onChange={(event) =>
											this.updateValue("showPlayerStats", event.target.checked)
										}
										checked={this.state.values.showPlayerStats}
										size="md"
									/>
									<Spacer y={1.2} />
									<Text>
										Show score info (Current swing values, total score, etc)
									</Text>
									<Switch
										onChange={(event) =>
											this.updateValue("showScoreInfo", event.target.checked)
										}
										checked={this.state.values.showScoreInfo}
										size="md"
									/>
									<Spacer y={1.2} />
									<Text>Show song info (Song name, bsr, song art, etc)</Text>
									<Switch
										onChange={(event) =>
											this.updateValue("showSongInfo", event.target.checked)
										}
										checked={this.state.values.showSongInfo}
										size="md"
									/>
									<Spacer y={1.2} />
									<Text>Show cut stats (Average cut)</Text>
									<Switch
										onChange={(event) =>
											this.updateValue("showCutStats", event.target.checked)
										}
										checked={this.state.values.showCutStats}
										size="md"
									/>
									<Spacer y={1.2} />
									<Text>
										Replace Player info with Song info when a song starts (Show
										song info Required)
									</Text>
									<Switch
										onChange={(event) =>
											this.updateValue(
												"shouldReplacePlayerInfoWithScore",
												event.target.checked
											)
										}
										checked={this.state.values.shouldReplacePlayerInfoWithScore}
										size="md"
									/>
									<Spacer y={1.2} />
									<Text>
										Show score raw pp (The raw pp value of the current score)
									</Text>
									<Switch
										onChange={(event) =>
											this.updateValue("showPp", event.target.checked)
										}
										checked={this.state.values.showPp}
										size="md"
									/>
									<Spacer y={1.2} />

									<Button.Group>
										<Button
											flat
											auto
											onPress={() => {
												if (!this.state.steamId) {
													toast.error("Please provide a Steam ID");
													return;
												}
												window.open(this.generateUrl(), "_blank");
											}}
										>
											Open Overlay
										</Button>
									</Button.Group>

									<Text
										css={{
											marginTop: "10px",
										}}
									>
										<Link href="https://github.com/RealFascinated/beatsaber-overlay">
											<a>
												If you like this project and want to support it. Come
												check out the project on GitHub!
											</a>
										</Link>
									</Text>
								</Card.Body>
							</Card>
						</Grid>
					</Grid.Container>
				</Container>

				<ToastContainer />
			</div>
		);
	}
}
