const
	assert = require('chai').assert,
	{ Column, ColumnFactory } = require('../libraries/column');

describe('column.js', () => {
	describe('Column', () => {
		const c = ColumnFactory.createColumn('name', 'TinyInt', {
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
			assert.doesNotThrow(() => c.set(1), TypeError);
		});

		it('set(2)', () => {
			assert.doesNotThrow(() => c.set(2), TypeError);
		});

		it('After set isChanged()', () => {
			assert.isTrue(c.isChanged());
		});

		it('get()', () => {
			assert.strictEqual(c.get(), 2);
		});
	});
});
