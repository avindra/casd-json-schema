const {createSchema} = require('./src/schema');
const {categories} =require('./config');


/**
 * Runs the program (parse to JSON schema).
 * 
 * $ node run.js > schema.json
 */
const schema = createSchema(categories);
console.log(JSON.stringify(schema, null, 4));