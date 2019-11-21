const fs = require('fs');
const path = require('path');

const currentDir = process.cwd();
const args = Array.isArray(process.argv) ? process.argv.slice(2) : [];
const configFile = (args[0] !== 'clean' && args[0]) || 'package.json';
const config = JSON.parse(fs.readFileSync(path.join(currentDir, configFile)).toString());

const clean = () =>
	Object.keys(config.exports).forEach(alias => {
		const aliasFile = path.join(currentDir, alias);
		fs.existsSync(aliasFile) && fs.unlinkSync(aliasFile);
	});

const linkExports = () => {
	Object.keys(config.exports).forEach(alias => {
		const aliasFile = path.join(currentDir, alias);

		try {
			require.resolve(config.exports[alias], { paths: [currentDir] });
			fs.writeFileSync(
				path.join(aliasFile),
				`module.exports = require('${config.exports[alias]}');`
			);
		} catch (e) {
			console.error(
				`Error: Cannot alias '${alias}' target '${config.exports[alias]}' from '${configFile}' exports\n`
			);
			process.exitCode = 1;
		}
	});

	if (process.exitCode === 1) {
		clean();
	}
};

if (config.exports && config.exports instanceof Object) {
	args[0] === 'clean' ? clean() : linkExports();
}
