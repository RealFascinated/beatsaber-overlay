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
		<div>
			<DefaultSeo
				titleTemplate={`${process.env.NEXT_PUBLIC_SITE_NAME} | %s`}
				description={process.env.NEXT_PUBLIC_SITE_DESCRIPTION}
				openGraph={{
					url: process.env.NEXT_PUBLIC_SITE_URL,
					title: process.env.NEXT_PUBLIC_SITE_NAME,
					description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
					site_name: process.env.NEXT_PUBLIC_SITE_NAME,
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
		</div>
	);
}

export default MyApp;
