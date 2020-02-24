# casd-json-schema

Get a JS friendly schema representation of the CA Service Management objects.

This can be used to facilitate rapid discovery of the API surface.

It converts the HTML documentation of tables spread across 50 different pages with an unhelpful navigation system, into a single JSON artifact.

## Implementation choices

The only documentation and data that exists is the technical reference PDF, and the online version.

Robust HTML parsing libraries are available, so this project uses [Playwright](https://github.com/microsoft/playwright) to browse through the documentation as needed, building up a standard JSON representation of the objects, using the [online reference manual hosted at Broadcom](http://techdocs.broadcom.com/content/broadcom/techdocs/us/en/ca-enterprise-software/business-management/ca-service-management/14-1.html).

 * all "objects," as defined by CA Web Services, including their appropriate attribute names
 * relationships between objects via foreign keys

## I thought SOAP handles this for me?

A well implemented SOAP API _should_ describe objects and their relationships. When it comes to the `doSelect` API, the "ease of use" intended by the SOAP protocol goes into a Web Services black box. The API rot can become worse if your organization filters API access through a gateway.

Hence, this project exists and can be used create visualizations or progamatically create APIs using the JSON schema artifact.

## Development

1. yarn or npm install the dependencies
2. view `config.js`              # Categories are limited to a default set. 
3. `node save_data.js`           # Download pages containing raw HTML (seed files)
4. `node parse.js`               # Generate structured representation (JSON artifact)

## Constraints

It is possible to add more categories, which would increase coverage of the API in the artifact.

The most immediate problem one would encounter, is supporting irregular URL patterns to cover other categories.

