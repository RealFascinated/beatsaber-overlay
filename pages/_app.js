// 1. import `NextUIProvider` component
import { NextUIProvider } from '@nextui-org/react';
import Head from 'next/head'

import Config from '../config.json';

import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  return (
    // 2. Use at the root of your app
    <NextUIProvider>
		<Head>
			<title>{Config.name}</title>
			<meta name="twitter:title" content= {Config.name} />
			<meta property="og:site_name" content= {Config.name} key="title" />
			<meta property="og:url" content= {Config.url} key="title" />
			<meta property="og:description" content= {Config.description} key="description" />
			<meta name="theme-color" content= {Config.color} />
		</Head>
      	<Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
