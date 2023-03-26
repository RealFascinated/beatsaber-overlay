import env from "@beam-australia/react-env";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { DefaultSeo } from "next-seo";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { VARS } from "../consts/EnvVars";
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
		<>
			<DefaultSeo
				titleTemplate={`${env(VARS.SITE_NAME)} - %s`}
				title={env(VARS.SITE_TITLE)}
				description={env(VARS.SITE_DESCRIPTION)}
				openGraph={{
					url: env(VARS.SITE_URL),
					title: env(VARS.SITE_NAME),
					description: env(VARS.SITE_DESCRIPTION),
					siteName: env(VARS.SITE_NAME),
					images: [
						{
							url: "https://git.fascinated.cc/Fascinated/beatsaber-overlay/media/branch/main/assets/overlay.png",
							alt: "Site Example",
						},
					],
				}}
				twitter={{
					cardType: "summary_large_image",
					// site: "@BeatSaber Overlay",
				}}
			/>
			<NextThemesProvider
				storageKey="theme"
				attribute="class"
				value={{
					dark: darkTheme,
					light: lightTheme,
				}}
			>
				<NextUIProvider>
					<Component {...pageProps} />
				</NextUIProvider>
			</NextThemesProvider>
		</>
	);
}

export default MyApp;
