import Redis from "ioredis";

const client = new Redis({
	port: process.env.REDIS_PORT,
	host: process.env.REDIS_HOST,
	password: process.env.REDIS_PASSWORD,
	db: process.env.REDIS_DATABASE,
});
client.connect().catch(() => {});

async function setValue(key, value, expireAt = 86400) {
	await client.set(key, value);
}

async function getValue(key) {
	const yes = new Promise((reject, resolve) => {
		client.get(key, (err, result) => {
			if (err !== null) {
				resolve(err);
			} else {
				reject(result);
			}
		});
	});
	const maybe = await yes;
	return maybe;
}

async function exists(key) {
	const yes = new Promise((reject, resolve) => {
		client.exists(key, (err, result) => {
			if (err !== null) {
				resolve(err);
			} else {
				reject(result);
			}
		});
	});
	const maybe = await yes;
	return maybe == 1 ? true : false;
}

module.exports = {
	getValue,
	setValue,
	exists,
};
