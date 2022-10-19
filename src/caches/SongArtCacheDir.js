const cacheDir = process.cwd() + path.sep + "cache";
if (!fs.existsSync(cacheDir)) {
	fs.mkdirSync(cacheDir);
	console.log("Created art cache directory");
}

module.exports = cacheDir;
