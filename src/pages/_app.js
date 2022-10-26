import env from "@beam-australia/react-env";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { DefaultSeo } from "next-seo";
import { ThemeProvider as NextThemesProvider } from "next-themes";
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
				titleTemplate={`${env("SITE_NAME")} | %s`}
				description={env("SITE_DESCRIPTION}")}
				openGraph={{
					url: env("SITE_URL"),
					title: env("SITE_NAME"),
					description: env("SITE_DESCRIPTION"),
					site_name: env("SITE_NAME"),
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
