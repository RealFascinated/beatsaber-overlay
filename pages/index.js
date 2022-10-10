import { Card, Container, Grid } from '@nextui-org/react';
import { Component } from 'react';
import NavBar from '../src/components/Navbar';

import styles from '../styles/main.module.css';

export default class Home extends Component {

	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());

		if (params.id) {
			document.location.href = "/overlay/"+ window.location.search
		}
	}

	render() {
		return <div className={styles.main}>
			<NavBar></NavBar>

			<Container css={{
				marginTop: '$15'
			}}>
				<Grid.Container>
					<Grid xs={12}>
						<Card>
							<Card.Body>
								hello!
							</Card.Body>
						</Card>
					</Grid>
				</Grid.Container>
			</Container>
		</div>
	}
}