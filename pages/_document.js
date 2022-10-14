import { CssBaseline } from "@nextui-org/react";
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
					{CssBaseline.flush()}
					<link
						href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
						rel="stylesheet"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Teko:wght@300&display=swap"
						rel="stylesheet"
					/>
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
