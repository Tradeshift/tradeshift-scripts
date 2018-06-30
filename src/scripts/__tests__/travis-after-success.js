import cases from 'jest-in-case';

// this removes the quotes around strings...
expect.addSnapshotSerializer({
	print: val => val,
	test: val => typeof val === 'string'
});

cases(
	'travis-after-success',
	({ version = '0.0.0-semantically-released', hasCoverageDir = true, branch = 'master' }) => {
		// beforeEach
		const { sync: crossSpawnSyncMock } = require('cross-spawn');
		const utils = require('../../utils');
		utils.resolveBin = (modName, { executable = modName } = {}) => executable;
		const originalExit = process.exit;
		process.exit = jest.fn();

		// tests
		crossSpawnSyncMock.mockClear();
		crossSpawnSyncMock.mockReturnValue({
			stdout: {
				toString() {
					return branch;
				}
			}
		});
		if (version) {
			utils.pkg.version = version;
		}
		utils.hasFile = filename => filename === 'coverage' && hasCoverageDir;
		require('../travis-after-success');
		expect(crossSpawnSyncMock).toHaveBeenCalledTimes(2);
		const [, secondCall] = crossSpawnSyncMock.mock.calls;
		const [script, calledArgs] = secondCall;
		expect([script, ...calledArgs].join(' ')).toMatchSnapshot();

		// afterEach
		process.exit = originalExit;
		jest.resetModules();
	},
	{
		'calls concurrently with both scripts': {},
		'does not do the autorelease script when the version is different': {
			version: '1.2.3'
		},
		'does not do the codecov script when there is no coverage directory': {
			hasCoverageDir: false
		},
		'adds dry-run flag when not running on master': {
			branch: 'dev-branch'
		}
	}
);
