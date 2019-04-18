const browserslist = require('browserslist');

const { ifAnyDep, parseEnv, appDirectory } = require('../utils');

const isTest = (process.env.BABEL_ENV || process.env.NODE_ENV) === 'test';
const isPreact = parseEnv('BUILD_PREACT', false);
const isRollup = parseEnv('BUILD_ROLLUP', false);
const isUMD = process.env.BUILD_FORMAT === 'umd';
const isWebpack = parseEnv('BUILD_WEBPACK', false);
const treeshake = parseEnv('BUILD_TREESHAKE', isRollup || isWebpack);
const alias = parseEnv('BUILD_ALIAS', isPreact ? { react: 'preact' } : null);

/**
 * use the strategy declared by browserslist to load browsers configuration.
 * fallback to the default if don't found custom configuration
 * @see https://github.com/browserslist/browserslist/blob/master/node.js#L139
 */
const browsersConfig = browserslist.loadConfig({ path: appDirectory }) || [
	'ie 11',
	'last 2 versions'
];

const envTargets = isTest
	? { node: 'current' }
	: isWebpack || isRollup
		? { browsers: browsersConfig }
		: { node: '6' };
const envOptions = { modules: false, loose: true, targets: envTargets };

module.exports = () => ({
	presets: [
		[require.resolve('@babel/preset-env'), envOptions],
        require.resolve('@babel/preset-typescript'),
		ifAnyDep(
			['react', 'preact'],
			[require.resolve('@babel/preset-react'), { pragma: isPreact ? 'React.h' : undefined }]
		)
	].filter(Boolean),
	plugins: [
		require.resolve('babel-plugin-macros'),
		alias ? [require.resolve('babel-plugin-module-resolver'), { root: ['./src'], alias }] : null,
		[
			require.resolve('babel-plugin-transform-react-remove-prop-types'),
			isPreact ? { removeImport: true } : { mode: 'unsafe-wrap' }
		],
		isUMD ? require.resolve('babel-plugin-transform-inline-environment-variables') : null,
		[require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
		require.resolve('babel-plugin-minify-dead-code-elimination'),
		require.resolve('@babel/plugin-proposal-object-rest-spread'),
		treeshake ? null : require.resolve('@babel/plugin-transform-modules-commonjs')
	].filter(Boolean)
});
