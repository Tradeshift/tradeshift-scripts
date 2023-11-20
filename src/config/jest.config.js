const path = require('path');
const { ifAnyDep, hasFile, hasPkgProp, fromRoot } = require('../utils');

const here = (p) => path.join(__dirname, p);

const useBuiltInBabelConfig = !hasFile('.babelrc') && !hasPkgProp('babel');
const junitConfig = hasPkgProp('jest-junit')
	? {}
	: {
			outputDirectory: fromRoot('build/junit'),
	  };

const ignores = [
	'/node_modules/',
	'/fixtures/',
	'/__tests__/helpers/',
	'__mocks__',
];

const jestConfig = {
	roots: [fromRoot('src')],
	testEnvironment: ifAnyDep(['webpack', 'rollup', 'react'], 'jsdom', 'node'),
	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)spec.[jt]s?(x)'],
	testPathIgnorePatterns: [...ignores],
	collectCoverageFrom: ['src/**/*.[jt]s?(x)'],
	coveragePathIgnorePatterns: [...ignores, 'src/(umd|cjs|esm)-entry.[jt]s$'],
	coverageReporters: ['text', 'cobertura', 'lcov', 'json'],
	transformIgnorePatterns: [
		'[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$',
		'node_modules/(?!axios)/', // transpile axios because it has es6 modules post v1
		// https://github.com/axios/axios/issues/5101#issuecomment-1275242123
	],
	reporters: ['default', [require.resolve('jest-junit'), junitConfig]],
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},
};

if (useBuiltInBabelConfig) {
	jestConfig.transform = { '^.+\\.[jt]sx?$': here('./babel-transform') };
}

module.exports = jestConfig;
