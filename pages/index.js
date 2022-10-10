import { Button, Card, Container, Grid, Input, Link, Modal, Spacer, Switch, Text, textTransforms } from '@nextui-org/react';
import { Component } from 'react';
import NavBar from '../src/components/Navbar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from '../styles/main.module.css';

export default class Home extends Component {

	constructor(props) {
		super(props);

		this.state = {
			steamId: undefined,
			isPreviewVisible: false,
			previewUrl: undefined,
			overlayUrl: undefined,

			values: {
				socketAddr: undefined,
				useBeatLeader: false,
				showPlayerStats: true,
				showScoreInfo: false,
				showSongInfo: false,
			},
		}
	}

	async componentDidMount() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());

		if (params.id) {
			document.location.href = "/overlay/"+ window.location.search
			return;
		}

		if (localStorage.getItem('values') == undefined) {
			localStorage.setItem('values', JSON.stringify({
				steamId: this.state.steamId,
				values: this.state.values
			}));
		} else {
			const json = JSON.parse(localStorage.getItem('values'))
			this.setState({ steamId: json.steamId, values: json.values });
		}
	}

	loadPreview() {
		this.setState({ isPreviewVisible: true, previewUrl: this.generateUrl(true) });
	}

	generateUrl(withTc = false) {
		let values = "";
		Object.entries(this.state.values).forEach(value => {
			if (value[1] === undefined) {
				return;
			}
			if (value[0] == "useBeatLeader" && value[1] === true) {
				values += `&beatLeader=${value[1]}`;
				return;
			}
			values += `&${value[0]}=${value[1]}`;
		});

		return window.location.origin + "/overlay?id=" + this.state.steamId + values + (withTc ? "&tc=black" : "");
	}

	updateValue(key, value) {
		let values = this.state.values;
		values[key] = value;
		this.setState({ values: values });
		this.updateStorage();
	}

	updateStorage() {
		setTimeout(() => {
			localStorage.setItem('values', JSON.stringify({
				steamId: this.state.steamId,
				values: this.state.values
			}));
		}, 5);
	}

	render() {
		return <div className={styles.main}>
			<NavBar></NavBar>

			<Container css={{
				marginTop: '$8'
			}}>

				{/* Preview */}
				{
					this.state.isPreviewVisible ? <Modal
						closeButton
						open={this.state.isPreviewVisible}
						width={"100%"}
						blur
						onClose={() => this.setState({ isPreviewVisible: false })}
					>
						<Modal.Header>
							<Text size={18}>
								Overlay Preview
							</Text>
						</Modal.Header>
						<Modal.Body>
							<iframe height={600} src={this.state.previewUrl}></iframe>	
						</Modal.Body>
					</Modal> : <></>
				}

				<Grid.Container gap={2}>
					<Grid xs={12}>
						<Card>
							<Card.Body>
								<Text>Welcome to the Setup panel</Text>
								
								<Spacer y={2} />	
								
								<Input
									underlined
									labelPlaceholder="Ip Address (Only set if you stream on multiple devices)"
									initialValue="localhost"
									value={this.state.values.socketAddr}
									onChange={event => this.updateValue("socketAddr", event.target.value)} checked={true}
								/>
								<Spacer y={2} />
								<Input
									underlined
									labelPlaceholder="Steam Id"
									initialValue=""
									value={this.state.steamId}
									onChange={event => {
										this.setState({ steamId: event.target.value });
										this.updateStorage();
									}}
								/>
								<Spacer y={1} />
								<Text>Do you want to use BeatLeader rather than ScoreSaber?</Text>
								<Switch onChange={event => this.updateValue("useBeatLeader", event.target.checked)} checked={this.state.values.useBeatLeader} size="md" />
								<Text>Do you want to show Player Stats (Current PP, global pos, etc)</Text>
								<Switch onChange={event => this.updateValue("showPlayerStats", event.target.checked)} checked={this.state.values.showPlayerStats} size="md" />
								<Text>Do you want to show Score Info (Current swing values, total score, etc)</Text>
								<Switch onChange={event => this.updateValue("showScoreInfo", event.target.checked)} checked={this.state.values.showScoreInfo} size="md" />
								<Text>Do you want to show Song Info (Song name, bsr, song art, etc)</Text>
								<Switch onChange={event => this.updateValue("showSongInfo", event.target.checked)} checked={this.state.values.showSongInfo} size="md" />
								<Spacer y={2} />

								<Button.Group>
									<Button flat auto onClick={() => {
										if (!this.state.steamId) {
											toast.error("Please provide a Steam ID");
											return;
										}
										window.open(this.generateUrl(), "_blank");
									}}>Open Overlay</Button>
									<Button flat auto onClick={() => {
										if (!this.state.steamId) {
											toast.error("Please provide a Steam ID");
											return;
										}
										this.loadPreview();
									}}>Preview</Button>
								</Button.Group>

								{
									this.state.overlayUrl !== undefined ?
										<>
											<Text b>
												Url
											</Text>
											<Link href={this.state.overlayUrl}>{this.state.overlayUrl}</Link>
										</>
									: <></>
								}
							</Card.Body>
						</Card>
					</Grid>
				</Grid.Container>
			</Container>

			<ToastContainer />
		</div>
	}
}