/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	swcMinify: true,
	compress: true,
	images: {
		domains: [
			"cdn.scoresaber.com",
			"cdn.beatleader.xyz",
			"eu.cdn.beatsaver.com",
			"cdn.fascinated.cc",
			"avatars.akamai.steamstatic.com",
		],
	},
	experimental: {
		optimizeCss: true,
	},
};

module.exports = nextConfig;
