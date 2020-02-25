const {readFileSync} = require('fs');
const {JSDOM} = require("jsdom");

/**
 * Create an environment to scrape data with.
 * 
 * JSDOM chosen due to availability of standard apis
 * in a browser-free environment.
 */
const createDOM = (category) => {
    const fData = readFileSync("./" + category + ".html")
    const dom = new JSDOM(fData);
    return dom;
}

module.exports = {
    createDOM,
}