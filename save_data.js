#!/usr/bin/env node
const { createWriteStream, existsSync } = require("fs");

const { categories, doc_base } = require("./config");
const { normalize } = require("./src/util");

for (const _category of categories) {
	const category = normalize(_category);
	const fileName = `${category}.html`;
	const targetFile = `./${fileName}`;
	const page = `${doc_base}/${fileName}`;
	if (existsSync(targetFile)) {
		console.log(` [${category}]: page in cache ${fileName} (skipped)`);
		continue;
	}

	console.log(`Fetching page ${page}...`);

	(async function () {
		const response = await fetch(page);
		const file = createWriteStream(targetFile);
		const txt = await response.text();
		file.write(txt);
	})();
}
