const {createDOM} = require("./env");
const {normalize} = require('./util');
const {categories} =require('./config');
const {parse} =require("./parse");


/**
 * Runs the program (parse to JSON schema).
 * 
 * $ node run.js > schema.json
 */
let schema = {};

for (const rawCategory of categories) {
    const category = normalize(rawCategory);
    console.error(`Parsing ${category}...`);

    /**
     * Create a dom representation of a
     * particular category
     */
    const root = createDOM(category);

    const {document} = root.window;

    /**
     * accumulate details about the schema
     * "Tax" the shape shufflers of v8, they
     * are quite sophisticated...
     */
    schema = {
        ...schema,
        ...parse(document),
    };
}

console.log(JSON.stringify(schema, null, 4));