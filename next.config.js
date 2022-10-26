/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		optimizeCss: true,
	},
	output: "standalone",
	swcMinify: true,
	images: {
		domains: ["cdn.scoresaber.com", "*.cdn.beatsaver.com", "cdn.fascinated.cc"],
	},
	publicRuntimeConfig: {
		httpProxy: process.env.HTTP_PROXY,
		siteName: process.env.SITE_NAME,
		siteTitle: process.env.SITE_TITLE,
		siteDescription: process.env.SITE_DESCRIPTION,
		siteColor: process.env.SITE_COLOR,
		siteUrl: process.env.SITE_URL,
	},
};

module.exports = nextConfig;
