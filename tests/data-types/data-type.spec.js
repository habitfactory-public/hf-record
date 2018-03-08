const
	assert = require('chai').assert,
	{ DataType } = require('../../libraries/data-types/data-type');

describe('data-type.js', () => {
	describe('Constructor', () => {
		const dataType = new DataType();

		it('checks default values', () => {
			assert.deepEqual(dataType.options, {
				strictMode: true
			});
		});

		it('vaildates "value"', () => {
			assert.isTrue(dataType.validate('value'));
		});

		it('transforms "value" into "value"', () => {
			assert.strictEqual(dataType.transform('value'), 'value');
		});

		it('transforms "" into ""', () => {
			assert.strictEqual(dataType.transform(''), '');
		});

		it('transforms null into null', () => {
			assert.strictEqual(dataType.transform(null), null);
		});

		it('transforms undefined into undefined', () => {
			assert.strictEqual(dataType.transform(undefined), undefined);
		});
	});

	describe('Validator', () => {
		const dataType = new DataType();

		dataType
			.addValidator(value => {
				return value <= 20;
			})
			.addValidator(value => {
				return value <= 10;
			});

		it('validates 5', () => {
			assert.isTrue(dataType.validate(5));
		});

		it('validates 15', () => {
			assert.isFalse(dataType.validate(15));
		});
	});

	describe('Transformer', () => {
		const dataType = new DataType();

		dataType
			.addTransformer(value => {
				return `inside ${value} inside`;
			})
			.addTransformer(value => {
				return `outside ${value} outside`;
			});

		it('transforms "value" into "outside inside value inside outside"', () => {
			assert.equal(dataType.transform('value'), 'outside inside value inside outside');
		});
	});
});
