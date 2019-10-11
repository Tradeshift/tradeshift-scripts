const pkg = require('../../package.json');

describe('jest', () => {
	it('supports dynamic import', () => {
		return import('../../package.json').then(({ default: data }) => {
			expect(data.name).toEqual(pkg.name);
		});
	});
});
