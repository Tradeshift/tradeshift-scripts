const { ifAnyDep } = require('../utils');

module.exports = {
	parser: 'babel-eslint',
	extends: [
		require.resolve('eslint-config-tradeshift'),
		require.resolve('eslint-config-tradeshift/jest'),
		ifAnyDep('typescript', require.resolve('eslint-config-tradeshift/typescript')),
		ifAnyDep('react', 'plugin:react/recommended')
	].filter(Boolean)
};
