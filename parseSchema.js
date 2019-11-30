#!/usr/bin/env node
const {categories,doc_base} =require('./config');

const puppeteer = require('puppeteer-core');

const isRequest = category => category === 'request';


/**
 * Convert UI-friendly names from the
 * <table> into a terser representation
 * for our schema object
 */
const tableHeaderToCode = {
'DB Field': 'table',
'Data Type': 'type',
'SREL References': 'link',
'Flags': 'flags',
};

const nillables = ['link', 'flags'];

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
const getRecords = () => {
	const tables = document.querySelectorAll('.table-wrapper table');
	return Array.from(tables).map(table => {
		const rows = table.querySelectorAll('tr');
		return Array.from(rows).map(el => el.innerText);
	});
}


/**
 * parses pure cell representation into structured form:
 *
 *
 * E.g.,
 *
 *     last_mod_by: {
 *     'DB Field': 'last_mod_by',
 *     'Data Type': 'SREL',
 *     'SREL References': 'cnt.id',
 *     Flags: ' '
 *   }
 * }
 * ]
 *
 *
 */
const tableDataToObject = (tableData) => {
	const [headerInfo, ...attributeLines] = tableData;
	const [_, ...headers] = headerInfo.split('\t');
	return attributeLines.reduce((acc, line) => {
		const cells = line.split('\t');
		const [attributeName, ...values] = cells;
		const info = {};
		headers.forEach((hdr, idx) => {
			const key = tableHeaderToCode[hdr];
			const value = values[idx];

			if (nillables.includes(key) && value === ' ') {
				// exclude representations for empty values
			} else {
				info[key] = value;
			}

		});
		acc[attributeName]  = info;
		return acc;
	}, {});

}

(async () => {
  const browser = await puppeteer.launch({executablePath: '/usr/bin/google-chrome'});
  const page = await browser.newPage();

  let schema = {};
  for (const category of categories) {
	 const file = isRequest(category) ? 'request' : `${category}-objects`;
	await page.goto(`${doc_base}/${file}.html`);

	const sections = await page.evaluate(getSections);

	const tableData = await page.evaluate(getRecords);

	const parsedTables = tableData.map(tableDataToObject);

	sections.forEach((section, index) => {
		parsedTables.forEach((table, offset) => {
			const s = sections[index + offset];
			schema[s] = table;
		})
	});
}

  console.log(JSON.stringify(schema, null, 2));

  await browser.close();
})();

