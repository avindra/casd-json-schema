const VERSION = "17.3";

const VERSION_TO_PASS = VERSION.replace(/\./g, "-");

//const doc_base = `http://techdocs.broadcom.com/content/broadcom/techdocs/us/en/ca-enterprise-software/business-management/ca-service-management/${VERSION_TO_PASS}/reference/ca-service-desk-manager-reference-commands/objects-and-attributes`

const doc_base = `https://techdocs.broadcom.com/us/en/ca-enterprise-software/business-management/ca-service-management/${VERSION_TO_PASS}/reference/ca-service-desk-manager-reference-commands/objects-and-attributes.html`;

module.exports = {
	categories: [
		"request",
		"relational-information",
		"problem-category",
		"workflow",
		"task",
		"change-request",
	],
	doc_base,
};
