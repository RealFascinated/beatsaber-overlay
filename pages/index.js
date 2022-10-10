import { Button, Card, Container, Grid, Input, Spacer, Switch, Text } from '@nextui-org/react';
import { Component } from 'react';
import NavBar from '../src/components/Navbar';

import styles from '../styles/main.module.css';

export default class Home extends Component {

	constructor(props) {
		super(props);

		this.state = {
			socketAddr: undefined,
			steamId: undefined,
			socketAddr: undefined,
		}
	}

	async componentDidMount() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());

		if (params.id) {
			document.location.href = "/overlay/"+ window.location.search
			return;
		}

		this.loadPreview();
	}

	loadPreview() {
		const previewiframe = document.getElementById('previewiframe');

		const id = this.state.steamId || "test";
		previewiframe.src = window.location.origin + "/overlay/?id=" + id + "&bg=000";
	}

	generateUrl() {
		
	}

	render() {
		return <div className={styles.main}>
			<NavBar></NavBar>

			<Container css={{
				marginTop: '$8'
			}}>
				<Grid.Container gap={2}>
					<Grid xs={12}>
						<Card>
							<Card.Body>
								<Text>Welcome to the Setup panel</Text>
								
								<Spacer y={2} />	
								
								<Input
									clearable
									underlined
									labelPlaceholder="Ip Address (Only set if you stream on multiple devices)"
									initialValue="localhost"
								/>
								<Spacer y={2} />
								<Input
									clearable
									underlined
									labelPlaceholder="Steam Id"
									initialValue=""
								/>
								<Spacer y={2} />
								<Text>Do you want to show Score Info (Current swing values, total score, etc)</Text>
								<Switch checked={true} size="md" />
								<Text>Do you want to show Player Stats (Current PP, global pos, etc)</Text>
								<Switch checked={true} size="md" />
								<Text>Do you want to show Song Info (Song name, bsr, song art, etc)</Text>
								<Switch checked={true} size="md" />
								<Spacer y={2} />

								<div>
									<Button auto>Generate</Button>
								</div>
							</Card.Body>
						</Card>
					</Grid>

					<Grid xs={12}>
						<Card>
							<Card.Body>
								<Text>Preview</Text>

								<iframe id='previewiframe' width={"100%"} height={450} frameBorder="0" border="0" cellSpacing="0"></iframe>
							</Card.Body>
						</Card>
					</Grid>
				</Grid.Container>
			</Container>
		</div>
	}
}