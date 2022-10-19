import { Container, Grid, Image, Link, Text } from "@nextui-org/react";
import { Component } from "react";

export default class Home extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Container
				css={{
					marginTop: "$15",
				}}
			>
				<Grid.Container gap={2}>
					<Grid
						xs={12}
						sm={6}
						justify="center"
						css={{
							textAlign: "center",
						}}
					>
						<div
							style={{
								marginTop: "30px",
							}}
						>
							<Text h2 b>
								Whoops! This page is unknown!
							</Text>
							<Text h3>
								<Link href="/">Click here to visit the main website</Link>
							</Text>
						</div>
					</Grid>
					<Grid xs={12} sm={6} justify="center">
						<Image
							alt="Helpful doggo"
							src="https://cdn.fascinated.cc/fPKqSysuqz.jpg?raw=true"
							css={{
								borderRadius: "5%",
								display: "initial",
							}}
						></Image>
					</Grid>
				</Grid.Container>
			</Container>
		);
	}
}
