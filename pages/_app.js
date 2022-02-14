import Head from 'next/head'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <>
		<Head>
			<title>BeatSaber Overlay</title>
			<meta name="twitter:title" content='BeatSaber Overlay' />
			<meta property="og:site_name" content="BeatSaber Overlay" key="title" />
			<meta property="og:url" content="https://bs-overlay.fascinated.cc" key="title" />
			<meta property="og:description" content="Simple scoresaber overlay" key="description" />
			<meta name="theme-color" content='#0EBFE9' />
		</Head>
		<Component {...pageProps} />
  	</>
}

export default MyApp
