const { resolveKcdScripts } = require('../utils');

const kcdScripts = resolveKcdScripts();

module.exports = {
	hooks: {
		'pre-commit': `${kcdScripts} precommit`,
	},
};
