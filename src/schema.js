const {createDOM} = require("./env");
const {normalize} = require('./util');
const {parse} =require("./parse");

const createSchema = (categories) => {
    const schema = {};

    for (const _category of categories) {
        const category = normalize(_category);
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
        const [ents, defs] = parse(document);
        ents.forEach((entity, i) => {
            schema[entity] = defs[i];
        });
    }
    return schema;
}

module.exports = {
    createSchema,
}