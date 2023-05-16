const { readFileSync } = require("fs");
const { JSDOM } = require("jsdom");

/**
 * Create an environment to scrape data with.
 *
 * JSDOM chosen due to availability of standard apis
 * in a browser-free environment.
 */
const createDOM = (category, scripts = false) => {
	const fData = readFileSync("./" + category + ".html");
	const options = scripts ? { runScripts: "dangerously" } : undefined;
	const dom = new JSDOM(fData, options);
	return dom;
};

module.exports = {
	createDOM,
};
