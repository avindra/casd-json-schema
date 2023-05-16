#!/usr/bin/env node
const http = require("http");
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
	http.get(page, (response) => {
		const { statusCode } = response;
		if (statusCode >= 400 && statusCode <= 599) {
			console.log(`Server returned failure ${statusCode}`);
		} else {
			const file = createWriteStream(targetFile);
			response.pipe(file);
		}
	});
}
