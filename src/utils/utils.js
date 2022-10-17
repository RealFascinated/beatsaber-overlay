import WebsiteTypes from "../consts/WebsiteType";

export default class Utils {
	constructor() {}

	/**
	 * Returns the information for the given website type.
	 *
	 * @param {WebsiteTypes} website
	 * @returns The website type's information.
	 */
	static getWebsiteApi(website) {
		return WebsiteTypes[website];
	}
}
