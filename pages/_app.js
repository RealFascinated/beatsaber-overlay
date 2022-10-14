// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";
import { NextSeo } from "next-seo";
import Head from "next/head";

import Config from "../config.json";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
	return (
		// 2. Use at the root of your app
		<NextUIProvider>
			<NextSeo
				title={Config.name}
				description={Config.description}
				openGraph={{
					url: Config.url,
					title: Config.name,
					description: Config.description,
					site_name: Config.name,
					images: [
						{
							url: "https://cdn.fascinated.cc/YrATaLjUOP.png?raw=true",
							alt: "Site Example",
						},
					],
				}}
				twitter={{
					cardType: "summary_large_image",
					site: "@BeatSaber Overlay",
				}}
			/>

			<Head>
				<meta name="theme-color" content={Config.color} />
				<meta
					property="og:keywords"
					content="BeatSaber,Overlay,OBS,Twitch,YouTube,BeatSaber Overlay,Github,"
				/>

				<noscript>
					<img src="https://analytics.fascinated.cc/ingress/4bc413fa-a126-4860-9a6a-22d10d5cf2fb/pixel.gif" />
				</noscript>
				<script
					defer
					src="https://analytics.fascinated.cc/ingress/4bc413fa-a126-4860-9a6a-22d10d5cf2fb/script.js"
				></script>
			</Head>
			<Component {...pageProps} />
		</NextUIProvider>
	);
}

export default MyApp;
