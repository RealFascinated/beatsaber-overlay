import {
	Button,
	Card,
	Container,
	Grid,
	Input,
	Link,
	Modal,
	Radio,
	Spacer,
	Spinner,
	Switch,
	Text,
} from "@nextui-org/react";
import { Component } from "react";
import NavBar from "../src/components/Navbar";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Utils from "../src/utils/utils";
import styles from "../styles/main.module.css";

export default class Home extends Component {
	constructor(props) {
		super(props);

		this._mounted = false;
		this.state = {
			loading: true,
			steamId: undefined,
			isPreviewVisible: false,
			previewUrl: undefined,
			overlayUrl: undefined,
			avatarUrl: undefined,

			values: {
				socketAddr: undefined,
				leaderboard: "ScoreSaber",
				showPlayerStats: true,
				showScoreInfo: false,
				showSongInfo: false,
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
				if (value[0] !== undefined) {
					values[value[0]] = value[1];
				}
			});

			this.setState({ steamId: json.steamId, values: values });
			this.validateSteamId(json.steamId || "");
		}
		this.setState({ loading: false });
	}

	loadPreview() {
		this.setState({
			isPreviewVisible: true,
			previewUrl: this.generateUrl(true),
		});
	}

	generateUrl(withTc = false) {
		let values = "";
		Object.entries(this.state.values).forEach((value) => {
			if (value[1] === undefined) {
				return;
			}
			if (value[0] == "leaderboard" && value[1] === "BeatLeader") {
				values += `&beatLeader=true`;
				return;
			}
			values += `&${value[0]}=${value[1]}`;
		});

		return (
			window.location.origin +
			"/overlay?id=" +
			this.state.steamId +
			values +
			(withTc ? "&textColor=black" : "")
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

		const data = await fetch("/api/validateid?steamid=" + steamId);
		const json = await data.json();

		if (json.message === "Valid") {
			this.setState({
				avatarUrl: `/api/steamavatar?steamid=${steamId}`,
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

				<Container
					css={{
						marginTop: "$8",
					}}
				>
					{/* Preview */}
					{this.state.isPreviewVisible ? (
						<Modal
							closeButton
							open={this.state.isPreviewVisible}
							width={"100%"}
							blur
							onClose={() => this.setState({ isPreviewVisible: false })}
						>
							<Modal.Header>
								<Text size={18}>Overlay Preview</Text>
							</Modal.Header>
							<Modal.Body>
								<iframe height={600} src={this.state.previewUrl}></iframe>
							</Modal.Body>
						</Modal>
					) : (
						<></>
					)}

					<Grid.Container gap={2} justify="center">
						<Grid
							xs={12}
							css={{
								color: "black",
							}}
							justify="center"
						>
							<div
								style={{
									textAlign: "center",
								}}
							>
								<Text h1 css={{ color: "$text" }}>
									BeatSaber Overlay
								</Text>
								<Text h4 css={{ color: "$text" }}>
									Welcome to the Setup panel
								</Text>
							</div>
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
										labelPlaceholder="Steam Id"
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
										defaultValue={this.state.values.leaderboard || "ScoreSaber"}
										onChange={(value) => {
											this.updateValue("leaderboard", value);
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
									<Text>
										Do you want to show Player Stats (Current PP, global pos,
										etc)
									</Text>
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
										Do you want to show Score Info (Current swing values, total
										score, etc)
									</Text>
									<Switch
										onChange={(event) =>
											this.updateValue("showScoreInfo", event.target.checked)
										}
										checked={this.state.values.showScoreInfo}
										size="md"
									/>
									<Spacer y={1.2} />
									<Text>
										Do you want to show Song Info (Song name, bsr, song art,
										etc)
									</Text>
									<Switch
										onChange={(event) =>
											this.updateValue("showSongInfo", event.target.checked)
										}
										checked={this.state.values.showSongInfo}
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
										<Button
											flat
											auto
											onPress={() => {
												if (!this.state.steamId) {
													toast.error("Please provide a Steam ID");
													return;
												}
												this.loadPreview();
											}}
										>
											Preview
										</Button>
									</Button.Group>

									<Text
										css={{
											marginTop: "10px",
										}}
									>
										<Link
											onPress={(event) => {
												Utils.openInNewTab(
													"https://github.com/RealFascinated/beatsaber-overlay"
												);
											}}
										>
											If you like this project and want to support it. Come
											check out the project on GitHub!
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
