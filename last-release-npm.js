/*
 * Fork of https://github.com/semantic-release/last-release-npm in order to have
 * proper certificate support. Uses npm binary instead of npm-registry-client.
 *
 **/

const SemanticReleaseError = require('@semantic-release/error');
const npmlog = require('npmlog');
const execa = require('execa');

async function getData(name, tag) {
	const res = await execa('npm', [
		'info',
		'--json',
		`${name}@${tag || 'latest'}`,
		'dist-tags',
		'version',
		'gitHead'
	]);
	return JSON.parse(res.stdout);
}

module.exports = async function({ retry } = {}, { pkg, npm, options }, cb) {
	npmlog.level = npm.loglevel || 'warn';

	try {
		let data = await getData(pkg.name, npm.tag);
		if (data && !data['dist-tags']) {
			return cb(null, {});
		}
		const distTags = data['dist-tags'];

		let version = distTags[npm.tag];
		if (
			!version &&
			options &&
			options.fallbackTags &&
			options.fallbackTags[npm.tag] &&
			distTags[options.fallbackTags[npm.tag]]
		) {
			version = distTags[options.fallbackTags[npm.tag]];
			data = await getData(pkg.name, version);
		}

		if (!version) {
			return cb(
				new SemanticReleaseError(
					`There is no release with the dist-tag "${npm.tag}" yet. Tag a version manually or define "fallbackTags".`,
					'ENODISTTAG'
				)
			);
		}

		cb(null, {
			version,
			gitHead: data.gitHead,
			get tag() {
				npmlog.warn('deprecated', 'tag will be removed with the next major release');
				return npm.tag;
			}
		});
	} catch (err) {
		if (err.statusCode === 404 || /not found/i.test(err.message)) {
			return cb(null, {});
		}
		return cb(err);
	}
};
