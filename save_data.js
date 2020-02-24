#!/usr/bin/env node
const http = require('http');
const {createWriteStream, existsSync} = require('fs');

const {categories, doc_base} = require('./config');
const {normalize} = require('./util');

for (const rawCategory of categories) {
	const category = normalize(rawCategory);
	const targetFile = `./raw/${category}.html`;
	const page = `${doc_base}/${category}.html`;
	if (existsSync(targetFile)) {
		console.log(`skipped download cached entity [${category}] ${page}`);
		continue;
	}

	console.log(`Fetching page ${page}...`);
	http.get(page, (response) => {
		const {statusCode} = response;
		if (statusCode >= 400 && statusCode <= 599) {
			console.log(`Server returned failure ${statusCode}`);
		} else {
			const file = createWriteStream(targetFile);
			response.pipe(file);
		}
	});
};
