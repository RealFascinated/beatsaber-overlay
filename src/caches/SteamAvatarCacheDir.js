import fs from "fs";
import path from "path";

const cacheDir = process.cwd() + path.sep + "cache";
if (!fs.existsSync(cacheDir)) {
	fs.mkdirSync(cacheDir);
	console.log("Created avatar cache directory");
}

module.exports = cacheDir;
