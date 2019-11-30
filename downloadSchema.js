#!/usr/bin/env node
const http = require('http');
const {createWriteStream, existsSync} = require('fs');

const {categories} = require('./config');

const VERSION = "14.1";

const VERSION_TO_PASS = VERSION.replace(/\./g, '-');

const doc_base = `http://techdocs.broadcom.com/content/broadcom/techdocs/us/en/ca-enterprise-software/business-management/ca-service-management/${VERSION_TO_PASS}/reference/ca-service-desk-manager-reference-commands/objects-and-attributes/`

for (const root of categories) {
	const targetFile = `./raw/${root}.html`;
	if (existsSync(targetFile)) {
		console.log(`Skipping download of ${root} since it's already cached.`);
		continue;
	}

	const file = createWriteStream(targetFile);

	const page = `${doc_base}/${root}-objects.html`;
	const request = http.get(page, (response) => response.pipe(file));
};
