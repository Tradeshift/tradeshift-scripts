const pkg = require('../../package.json');

describe('jest', () => {
	it('supports dynamic import', () => {
		return import('../../package.json').then(({ default: data }) => {
			expect(data.name).toEqual(pkg.name);
		});
	});
	it('supports optional chaining operator', () => {
		const o = { a: { b: { c: 'see' } } };
		expect(o?.a?.b?.c).toEqual('see');
		expect(o?.a?.z?.c).toEqual(undefined);
	});
	it('supports nullish-coalescing-operator', () => {
		const o = { a: 'foo', c: null };
		expect(o.b ?? 'default').toEqual('default');
		expect(o.c ?? 'default').toEqual('default');
	});
	it('supports class properties', () => {
		class ClassExample {
			instanceProperty = 'bork';
			static staticProperty = 'babelIsCool';
		}
		const i = new ClassExample();
		expect(i.instanceProperty).toEqual('bork');
		expect(ClassExample.staticProperty).toEqual('babelIsCool');
	});
});
