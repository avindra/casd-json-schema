#!/usr/bin/env node
const {categories} =require('./config');

const {normalize} = require('./src/util');
const {createDOM} = require('./src/env');

const byTitle = (title) => a => a.title === title;

const onlyObjects = a => /-objects\.html$/.test(a.link);
const toRepresentation = a => a.link.match(/([A-z]+)-objects\.html$/)[1];

/**
 * Grab all category defintions for navigation
 * from JavaScript in the page
 */
for (const _category of categories) {
  const category = normalize(_category);
  const {window} = createDOM(category, true);
  const {tocJSON} = window;

  if (!tocJSON) {
    console.log('failure to parse TOC on page', category);
    continue;
  }

  const items = tocJSON
    .find(byTitle('Reference'))
    .children[0]
    .children
    .find(byTitle('Objects and Attributes'))
    .children
    .filter(onlyObjects)
    .map(toRepresentation);

  console.log('objects are', items);
  // only need a single version of tocJSON
  break;
}



