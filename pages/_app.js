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
			<title>{Config.title}</title>
			<meta name="twitter:title" content= {Config.name} />
			<meta property="og:site_name" content= {Config.name} key="title" />
			<meta property="og:url" content= {Config.url} key="title" />
			<meta property="og:description" content= {Config.description} key="description" />
			<meta name="theme-color" content= {Config.color} />	
			<meta name="description" content= {Config.description}></meta>
			<noscript>
			<img src="https://analytics.fascinated.cc/ingress/4bc413fa-a126-4860-9a6a-22d10d5cf2fb/pixel.gif" />
			</noscript>
			<script defer src="https://analytics.fascinated.cc/ingress/4bc413fa-a126-4860-9a6a-22d10d5cf2fb/script.js"></script>
		</Head>
      	<Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
