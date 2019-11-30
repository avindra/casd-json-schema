#!/usr/bin/env node
const {categories,doc_base} =require('./config');

const puppeteer = require('puppeteer-core');

const isRequest = category => category === 'request';


const mapQuery = (nodes, mapperFn) => {
	const arr = new Array(nodes.length);
	nodes.forEach((element, index) => {
		arr[index] = mapperFn(element);
	});
	return arr;
}


const getSections = () => {
	const elements = document.querySelectorAll('.myToc0 li a');
	return Array.from(elements).map(element => element.innerHTML);
}

/**
 * This returns table data in the form of:
 *  [
    'Attribute\tDB Field\tData Type\tSREL References\tFlags',
    'code\tcode\tSTRING\t \t ',
    'delete_flag\tdelete_flag\tINTEGER\t \tLogical database delete status.',
    'description\tdescription\tSTRING\t \tTextual description of the meaning of the status.',
    'id\tid\tINTEGER\t \tUNIQUE KEY',
    'is_resolved\tis_resolved\tINTEGER\t \tUsed in stored queries to distinguish Resolved and Unresolved conflicts.',
    'last_mod_by\tlast_mod_by\tUUID\tca_contact\tUser who last updated this',
    'last_mod_dt\tlast_mod_dt\tLOCAL_TIME\t \tIndicates the timestamp of last update to this record.',
    'sym\tsym\tSTRING\t \tText value displayed to the user.'
  ],
 */
const getCells = () => {
	const tables = document.querySelectorAll('.table-wrapper table');
	return Array.from(tables).map(table => {
		const cells = table.querySelectorAll('tr');
		return Array.from(cells).map(el => el.innerText);
	});
}

(async () => {
  const browser = await puppeteer.launch({executablePath: '/usr/bin/google-chrome'});
  const page = await browser.newPage();

  for (const category of categories) {
		 const file = isRequest(category) ? 'request' : `${category}-objects`;
		await page.goto(`${doc_base}/${file}.html`);

	const sections = await page.evaluate(getSections);
	const cells = await page.evaluate(getCells);

	console.log('cells', cells);
}


  await browser.close();
})();

