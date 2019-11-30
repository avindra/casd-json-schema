#!/usr/bin/env node
const {readFileSync}=require('fs');
const {categories} =require('./config');

const puppeteer = require('puppeteer-core');

const byTitle = (title) => a => a.title === title;

const onlyObjects = a => /-objects\.html$/.test(a.link);

(async () => {
  const browser = await puppeteer.launch({executablePath: '/usr/bin/google-chrome'});
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
	  	  .filter(onlyObjects);

	console.log('items', items);
}


  await browser.close();
})();

