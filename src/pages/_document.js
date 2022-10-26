import env from "@beam-australia/react-env";
import { CssBaseline, Image } from "@nextui-org/react";
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

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

					<meta name="theme-color" content={"#" + env("SITE_COLOR")} />
					<meta
						property="og:keywords"
						content="BeatSaber,Overlay,OBS,Twitch,YouTube,BeatSaber Overlay,Github,"
					/>

					<noscript>
						<Image
							alt="For page analytics"
							src="https://analytics.fascinated.cc/ingress/4bc413fa-a126-4860-9a6a-22d10d5cf2fb/pixel.gif"
						/>
					</noscript>
					<script
						defer={true}
						src="https://analytics.fascinated.cc/ingress/4bc413fa-a126-4860-9a6a-22d10d5cf2fb/script.js"
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
