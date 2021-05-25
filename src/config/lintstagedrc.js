const { resolveKcdScripts, resolveBin, ifAnyDep } = require('../utils');

const kcdScripts = resolveKcdScripts();
const doctoc = ifAnyDep('doctoc') ? resolveBin('doctoc') : false;

module.exports = {
	'**/*.+(js|jsx|json|less|css|ts|tsx)': [
		`${kcdScripts} format`,
		`${kcdScripts} lint`,
		`${kcdScripts} test --findRelatedTests`,
	],
	'README.md': doctoc ? [`${doctoc} --maxlevel 2 --notitle`] : [],
};
