#!/usr/bin/env node
const http = require('http');
const {createWriteStream, existsSync} = require('fs');

const {categories, doc_base} = require('./config');

for (const root of categories) {
	const targetFile = `./raw/${root}.html`;
	if (existsSync(targetFile)) {
		console.log(`Skipping download of ${root} since it's already cached.`);
		continue;
	}

	const file = createWriteStream(targetFile);

	const page = `${doc_base}/${root}-objects.html`;
	http.get(page, (response) => response.pipe(file));
};
