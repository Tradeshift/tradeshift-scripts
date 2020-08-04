const envCi = require('env-ci');
const spawn = require('cross-spawn');
const {
	resolveBin,
	getConcurrentlyArgs,
	hasFile,
	fromRoot,
	pkg,
} = require('../utils');

const autorelease = pkg.version === '0.0.0-semantically-released';

// We don't care about the TravisCI validation
const releaseConfig = hasFile('release.config.js')
	? require(fromRoot('release.config.js'))
	: {};
const releaseBranch = releaseConfig.branch || 'master';
const { branch } = envCi();
// Run a dry-run release when not on master
const dryRun = branch !== releaseBranch;
const releaseFlags = [
	'--no-ci',
	dryRun ? '--dry-run' : '',
	dryRun ? `--branch ${branch}` : '',
]
	.filter(Boolean)
	.join(' ');

const result = spawn.sync(
	resolveBin('concurrently'),
	getConcurrentlyArgs(
		{
			codecov: hasFile('coverage')
				? "echo installing codecov && npx -p codecov -c 'echo running codecov && codecov'"
				: null,
			release: autorelease
				? `echo installing semantic-release && npx -p semantic-release@15 -c 'echo running semantic-release ${
						dryRun ? 'dry run' : ''
				  } && semantic-release ${releaseFlags}'`
				: null,
		},
		{ killOthers: false },
	),
	{ stdio: 'inherit' },
);

process.exit(result.status);
