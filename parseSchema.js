#!/usr/bin/env node
const {categories,doc_base} =require('./config');

const playwright = require('playwright');

const isRequest = category => category === 'request';


/**
 * String representation to use to indicate
 * a foreign key / relationship.
 */
const RELATION = 'LINK';

/**
 * Convert UI-friendly names from the
 * <table> into a terser representation
 * for our schema object
 */
const tableHeaderToCode = {
'DB Field': 'field',
'Data Type': 'type',
'SREL References': RELATION,
'Flags': 'flags',
};

const nillables = [RELATION, 'flags'];

const getEntities = () => {
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
 *   {
 *     'name': 'last_mod_by', 
 *     'type': 'SREL',
 *     'link': 'cnt.id'
 *   }
 *
 */
const tableDataToObject = (tableData) => {
	const [headerInfo, ...attributeLines] = tableData;
	const [_, ...headers] = headerInfo.split('\t');
	return attributeLines.reduce((acc, line) => {
		const cells = line.split('\t');
		const [attributeName, ...values] = cells;
		const info = {name: attributeName};
		headers.forEach((hdr, idx) => {
			const key = tableHeaderToCode[hdr];
			const value = values[idx];

			if (nillables.includes(key) && /^\s+$/.test(value)) {
				// exclude representations for empty values
			} else {
				info[key] = value;
			}

		});

		acc.push(info);
		return acc;
	}, []);

}

(async () => {
  const browser = await playwright['firefox'].launch({executablePath: '/usr/bin/firefox'});
  const page = await browser.newPage();

  let schema = {};
  for (const category of categories) {
	 const file = isRequest(category) ? 'request' : `${category}-objects`;
	await page.goto(`${doc_base}/${file}.html`);

	const entities = await page.evaluate(getEntities);

	const tableData = await page.evaluate(getRecords);

	const parsedTables = tableData.map(tableDataToObject);

	entities.forEach((section, index) => {
		parsedTables.forEach((table, j) => {
			const offset = j ;
			const s = entities[offset] || 'unk';
			const clean_s = s.replace(/ Object$/, '');
			if (table) {
				const attributes = table.filter(att => !(RELATION in att));
				const links = table.filter(att => RELATION in att);
				schema[clean_s] = {
					attributes,
					links,
				};
			} else {
				console.warn('no table at', index, offset, 'for', entities);
			}
		})
	});
}

  console.log(JSON.stringify(schema, null, 2));

  await browser.close();
})();

