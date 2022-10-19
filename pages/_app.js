import { createTheme, Image, NextUIProvider } from "@nextui-org/react";
import { NextSeo } from "next-seo";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Head from "next/head";

import Config from "../config.json";

import "../styles/globals.css";

const lightTheme = createTheme({
	type: "light",
	theme: {
		colors: {},
	},
});

const darkTheme = createTheme({
	type: "dark",
	theme: {
		colors: {},
	},
});

function MyApp({ Component, pageProps }) {
	return (
		<NextThemesProvider
			storageKey="theme"
			attribute="class"
			value={{
				dark: darkTheme,
				light: lightTheme,
			}}
		>
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
								url: "https://cdn.fascinated.cc/fHknFPctAC.png?raw=true",
								alt: "Site Example",
							},
						],
					}}
					twitter={{
						cardType: "summary_large_image",
						site: "@BeatSaber Overlay",
					}}
				/>
				<Component {...pageProps} />
			</NextUIProvider>
		</NextThemesProvider>
	);
}

export default MyApp;
