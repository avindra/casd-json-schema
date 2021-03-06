# casd-json-schema

Get a JS friendly schema representation of the CA Service Management objects.

This can be used to facilitate rapid discovery of the API surface.

It converts the HTML documentation of tables spread across 50 different pages with an unhelpful navigation system, into a single JSON artifact.

## Requirements

This has been developed and tested using node.js. There is one dependency, `jsdom`, which is used for scraping data from HTML pages using standard web apis.

## Usage

A `Makefile` is included for convenience.

Just run `make` to get the `schema.json` file.

## I thought SOAP handles this for me?

A well implemented SOAP API _should_ describe objects and their relationships. When it comes to the `doSelect` API, the "ease of use" intended by the SOAP protocol goes into a Web Services black box. The API rot can become worse if your organization filters API access through a gateway.

Hence, this project exists and can be used create visualizations or programatically create APIs using the JSON schema artifact.

## Development

1. yarn or npm install the dependencies
2. view `config.js`              # Categories are limited to a default set. 
3. `node save_data.js`           # Download pages containing input HTML data (seed files)
4. `node run.js > schema.json`   # Generate structured representation (JSON artifact) from the seed files

## Constraints

It is possible to add more categories, which would increase coverage of the API in the artifact.

The most immediate problem one would encounter, is supporting irregular URL patterns to cover other categories.

## Development history

The only documentation and data that exists is the technical reference PDF, and the online version.

Robust HTML parsing libraries are available, so the first implementation in November 2019 used [Puppeteer/Playwright](https://github.com/microsoft/playwright) to browse through the documentation as needed, building up a standard JSON representation of the objects, using the [online reference manual hosted at Broadcom](http://techdocs.broadcom.com/content/broadcom/techdocs/us/en/ca-enterprise-software/business-management/ca-service-management/14-1.html).

 * all "objects," as defined by CA Web Services, including their appropriate attribute names
 * relationships between objects via foreign keys

 In early 2020, I moved the parsing code to JSDOM, which runs faster and should be easier to maintain.