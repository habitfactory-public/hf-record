const
	assert = require('chai').assert,
	{ Column } = require('../libraries/column'),
	{ DataTypeFactory } = require('../libraries/data-types/data-type'),
	{ TableFactory } = require('../libraries/table');

describe('table.js', () => {
	describe('Table', () => {
		describe('Default', () => {
			const 
				hook = value => {
					value += '';
					return value;
				},
				t = TableFactory.createTable('name', {
					columns: [
						{
							name: 'tinyIntColumn',
							dataType: 'TinyInt',
							attributes: {
								length: 4
							}
						}
					],
					hooks: {
						beforeSave: [hook]
					}
				});
			
			it('getName()', () => {
				assert.strictEqual(t.getName(), 'name');
			});

			it('getColumns()', () => {
				assert.instanceOf(t.getColumns()['tinyIntColumn'], Column);
			});

			it('getColumn()', () => {
				assert.instanceOf(t.getColumn('tinyIntColumn'), Column);
			});

			it('getHook() #1', () => {
				assert.lengthOf(t.getHook('beforeSave'), 1);
			});

			it('getHook() #2', () => {
				assert.strictEqual(t.getHook('beforeSave')[0].toString(), hook.toString());
			});

			it('runHook()', () => {
				return t
					.runHook('beforeSave', 1)
					.then(value => {
						assert.strictEqual(value, '1');
					});
			});
		});
	});
});
