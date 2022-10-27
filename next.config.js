/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		optimizeCss: true,
	},
	output: "standalone",
	swcMinify: true,
	images: {
		domains: [
			"cdn.scoresaber.com",
			"eu.cdn.beatsaver.com",
			"cdn.fascinated.cc",
		],
	},
};

module.exports = nextConfig;
