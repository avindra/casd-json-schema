#!/usr/bin/env node

/**
 * String representation to use to indicate
 * a foreign key / relationship.
 */
const RELATION = "LINK";

/**
 * Convert UI-friendly names from the
 * <table> into a terser representation
 * for our schema object
 */
const tableHeaderToCode = {
	"DB Field": "field",
	"Data Type": "type",
	"SREL References": RELATION,
	Flags: "flags",
};

const nillables = [RELATION, "flags"];

/**
 * Table row data is in the form of:
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
	const [_, ...headers] = headerInfo;
	return attributeLines.reduce((acc, line) => {
		const cells = line;
		const [attributeName, ...values] = cells;
		const info = { name: attributeName };
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
};

function parse(document) {
	const tables = [...document.querySelectorAll("table")];
	const entities = [
		...document.querySelectorAll("[data-outputclass='bc-h2']"),
	].map((a) => a.textContent.replace(/ Object$/, ""));
	console.error(entities.length + " entities found");

	const tablesByRow = tables.map((t) => [...t.querySelectorAll("tr")]);
	const tableData = tablesByRow.map((rowList) =>
		rowList.map((row) =>
			[...row.querySelectorAll("td")].map((cell) => cell.textContent),
		),
	);

	const parsedTables = tableData.map(tableDataToObject);

	const entityDefinitions = new Array(entities.length);

	entities.forEach((entity, i) => {
		console.error("building", entity);

		parsedTables.forEach((table) => {
			const attributes = table.filter((att) => !(RELATION in att));
			const links = table.filter((att) => RELATION in att);

			entityDefinitions[i] = { attributes, links };
		});
	});

	return [entities, entityDefinitions];
}

module.exports = {
	parse,
};
