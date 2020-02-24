const {createSchema} = require('./createSchema');


/**
 * Runs the program (parse to JSON schema).
 * 
 * $ node run.js > schema.json
 */
const schema = createSchema();
console.log(JSON.stringify(schema, null, 4));