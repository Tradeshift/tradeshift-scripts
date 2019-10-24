const path = require('path');
const { ifAnyDep, hasFile, hasPkgProp, fromRoot } = require('../utils');

const here = p => path.join(__dirname, p);

const useBuiltInBabelConfig = !hasFile('.babelrc') && !hasPkgProp('babel');
const junitConfig = hasPkgProp('jest-junit')
	? {}
	: {
			output: fromRoot('build/junit/results.xml')
	  };

const ignores = ['/node_modules/', '/fixtures/', '/__tests__/helpers/', '__mocks__'];

const jestConfig = {
	roots: [fromRoot('src')],
	testEnvironment: ifAnyDep(['webpack', 'rollup', 'react'], 'jsdom', 'node'),
	collectCoverageFrom: ['src/**/*.[jt]s?(x)'],
	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+spec.[jt]s?(x)'],
	testPathIgnorePatterns: [...ignores],
	coveragePathIgnorePatterns: [...ignores, 'src/(umd|cjs|esm)-entry.[jt]s$'],
	transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
	reporters: ['default', [require.resolve('jest-junit'), junitConfig]],
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100
		}
	}
};

if (useBuiltInBabelConfig) {
	jestConfig.transform = { '^.+\\.[jt]s$': here('./babel-transform') };
}

module.exports = jestConfig;
