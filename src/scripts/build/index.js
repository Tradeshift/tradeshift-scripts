if (process.argv.includes('--browser') || process.argv.includes('--bundle')) {
	console.error('tradeshift-scripts no longer supports rollup bundling');
	process.exit(1);
}

require('./babel');
