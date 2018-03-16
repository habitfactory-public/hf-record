const
	assert = require('chai').assert,
	{ Column, ColumnFactory } = require('../libraries/column');

describe('column.js', () => {
	describe('Column', () => {
		describe('Default', () => {
			const c = ColumnFactory.createColumn('name', 'TinyInt', {
					isStrictMode: true,
					isPrimaryKey: false,
					isNotNull: true,
					isBinary: false,
					isUnsigned: true,
					isZeroFill: false,
					isReadonly: false,
					isMagicColumn:false,
					length: 4
				});

			it('getName()', () => {
				assert.strictEqual(c.getName(), 'name');
			});

			it('isPrimaryKey()', () => {
				assert.isFalse(c.isPrimaryKey());
			});

			it('isNotNull()', () => {
				assert.isTrue(c.isNotNull());
			});

			it('isBinary()', () => {
				assert.isFalse(c.isBinary());
			});

			it('isUnsigned()', () => {
				assert.isTrue(c.isUnsigned());
			});

			it('isZeroFill()', () => {
				assert.isFalse(c.isZeroFill());
			});

			it('isReadonly()', () => {
				assert.isFalse(c.isReadonly());
			});

			it('isMagicColumn()', () => {
				assert.isFalse(c.isMagicColumn());
			});

			it('Before set isChanged()', () => {
				assert.isFalse(c.isChanged());
			});

			it('set(1)', () => {
				assert.isTrue(c.set(1));
			});

			it('set(2)', () => {
				assert.isTrue(c.set(2));
			});

			it('After set isChanged()', () => {
				assert.isTrue(c.isChanged());
			});

			it('get()', () => {
				assert.strictEqual(c.get(), 2);
			});
		});

		describe('Readonly', () => {
			const c = ColumnFactory.createColumn('name', 'TinyInt', {
					isStrictMode: true,
					isPrimaryKey: false,
					isNotNull: true,
					isBinary: false,
					isUnsigned: true,
					isZeroFill: false,
					isReadonly: true,
					isMagicColumn:false,
					length: 4
				});

			it('isReadonly()', () => {
				assert.isTrue(c.isReadonly());
			});
			
			it('set(1)', () => {
				assert.isTrue(c.set(1));
			});

			it('set(2)', () => {
				assert.isFalse(c.set(2));
			});

			it('get()', () => {
				assert.strictEqual(c.get(), 1);
			})
		});

		describe('NotNull', () => {
			const c = ColumnFactory.createColumn('name', 'TinyInt', {
					isStrictMode: true,
					isPrimaryKey: false,
					isNotNull: true,
					isBinary: false,
					isUnsigned: true,
					isZeroFill: false,
					isReadonly: true,
					isMagicColumn:false,
					length: 4
				});

			it('isStrictMode()', () => {
				assert.isTrue(c.isStrictMode());
			});
			
			it('isNotNull()', () => {
				assert.isTrue(c.isNotNull());
			});

			it('set(1)', () => {
				assert.isTrue(c.set(1));
			});

			it('set(null)', () => {
				assert.throws(() => c.set(null), TypeError, 'name can\'t be null.');
			});
		});

		describe('PrimaryKey', () => {
			const c = ColumnFactory.createColumn('name', 'TinyInt', {
					isStrictMode: true,
					isPrimaryKey: true,
					isNotNull: true,
					isBinary: false,
					isUnsigned: true,
					isZeroFill: false,
					isReadonly: true,
					isMagicColumn:false,
					length: 4
				});

			it('isPrimaryKey()', () => {
				assert.isTrue(c.isPrimaryKey());
			});

			it('set(1)', () => {
				assert.isTrue(c.set(1));
			});

			it('set(2)', () => {
				assert.isFalse(c.set(2));
			});

			it('get()', () => {
				assert.strictEqual(c.get(), 1);
			});
		});
	});
});
