#!/usr/bin/env node
let shouldThrow;
const scriptsPkgName = require('../package.json').name;
try {
	shouldThrow =
		require(`${process.cwd()}/package.json`).name === scriptsPkgName &&
		Number(process.version.slice(1).split('.')[0]) < 8;
} catch (error) {
	// ignore
}

if (shouldThrow) {
	throw new Error(
		`You must use Node version 8 or greater to run the scripts within ${scriptsPkgName} ` +
			'because we dogfood the untranspiled version of the scripts.'
	);
}

require('./run-script');
