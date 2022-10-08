import WebsiteTypes from "../consts/WebsiteType";

export default class Utils {
    constructor() {};

    /**
     * Returns the information for the given website type.
     * 
     * @param {String} website 
     * @returns The website type's information.
     */
    getWebsiteApi(website) {
        return WebsiteTypes[website]
    }
}