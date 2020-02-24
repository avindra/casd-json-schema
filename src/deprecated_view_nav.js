#!/usr/bin/env node
const {categories} =require('./config');

const playwright = require('playwright');

const byTitle = (title) => a => a.title === title;

const onlyObjects = a => /-objects\.html$/.test(a.link);
const toRepresentation = a => a.link.match(/([A-z]+)-objects\.html$/)[1];

/**
 * This is a script that was built to try to grab all
 * possible categories in the navigation.
 * 
 * It is broken but structurally has sound ideas for
 * getting that list programatically.
 */
(async () => {
  const browser = await playwright['firefox'].launch({
	  executablePath: '/usr/bin/firefox',
  });
  const page = await browser.newPage();

  for (const category of categories) {
	await page.goto(`file://${__dirname}/raw/${category}.html`);
	const tocJSON = await page.evaluate(() => window.tocJSON);

	  if (!tocJSON) {
		  console.log('failrure to parse TOC on page', category);
		  continue;
	  }

	  const items = tocJSON
		  .find(byTitle('Reference'))
		  .children[0]
		  .children
		  .find(byTitle('Objects and Attributes'))
		  .children
		  .filter(onlyObjects)
		  .map(toRepresentation);

	  console.log('objects are', items);
	  // only need a single version of tocJSON
	  break;
}


  await browser.close();
})();

