const { resolveKcdScripts, resolveBin } = require('../utils');

const kcdScripts = resolveKcdScripts();
const doctoc = resolveBin('doctoc');

module.exports = {
	'**/*.+(js|jsx|json|less|css|ts|tsx)': [
		`${kcdScripts} format`,
		`${kcdScripts} lint`,
		`${kcdScripts} test --findRelatedTests`,
	],
	'README.md': [`${doctoc} --maxlevel 2 --notitle`],
};
