import env from "@beam-australia/react-env";
import { CssBaseline } from "@nextui-org/react";
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";
import { VARS } from "../consts/EnvVars";

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return {
			...initialProps,
			styles: React.Children.toArray([initialProps.styles]),
		};
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<script defer src="/__ENV.js" />
					{CssBaseline.flush()}

					<link
						href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
						rel="stylesheet"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Teko:wght@300&display=swap"
						rel="stylesheet"
					/>
					<link rel="shortcut icon" href="/favicon.ico" />

					<meta name="theme-color" content={"#" + env(VARS.SITE_COLOR)} />
					<meta
						property="og:keywords"
						content="BeatSaber, Overlay, OBS, Twitch, YouTube, BeatSaber Overlay, Github, Beat Saber overlay, ScoreSaber, BeatLeader, VR gaming, Twitch stream enhancement, Customizable overlay, Real-time scores, Rankings, Leaderboard information, Stream enhancement, Professional overlay, Easy to use overlay builder."
					/>

					<script
						defer
						data-domain="bs-overlay.fascinated.cc"
						src="https://analytics.fascinated.cc/js/script.js"
					></script>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
