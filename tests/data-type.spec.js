const
	assert = require('chai').assert,
	{ DataType, DataTypeFactory } = require('../libraries/data-types/data-type'),
	DateAndTimeType = require('../libraries/data-types/date-and-time'),
	NumericType = require('../libraries/data-types/numeric'),
	StringType = require('../libraries/data-types/string');

describe('data-type.js', () => {
	describe('DataType', () => {
		describe('Constructor', () => {
			const dt = new DataType();

			describe('Check default values', () => {
				it('isStrictMode()', () => {
					assert.isTrue(dt.isStrictMode());
				});

				it('isNotNull()', () => {
					assert.isFalse(dt.isNotNull());
				});

				it('isBinary()', () => {
					assert.isFalse(dt.isBinary());
				});

				it('isUnsigned()', () => {
					assert.isFalse(dt.isUnsigned());
				});

				it('isZeroFill()', () => {
					assert.isFalse(dt.isZeroFill());
				});
			});

			it('vaildates "value"', () => {
				assert.isTrue(dt.validate('value'));
			});

			it('transforms "value" into "value"', () => {
				assert.strictEqual(dt.transform('value'), 'value');
			});

			it('transforms "" into ""', () => {
				assert.strictEqual(dt.transform(''), '');
			});

			it('transforms null into null', () => {
				assert.strictEqual(dt.transform(null), null);
			});

			it('transforms undefined into undefined', () => {
				assert.strictEqual(dt.transform(undefined), undefined);
			});
		});

		describe('Validator', () => {
			const dt = new DataType();

			dt.appendValidator([
				value => value.isBetween({
					MIN: 10,
					MAX: 20
				}),
				value => value.get() === '가'
			]);

			it('validates 5', () => {
				assert.isFalse(dt.validate(5));
			});

			it('validates 15', () => {
				assert.isTrue(dt.validate(15));
			});

			it('validates "가"', () => {
				assert.isTrue(dt.validate('가'));
			});

			it('validates "나"', () => {
				assert.isFalse(dt.validate('나'));
			});
		});

		describe('Transformer', () => {
			const dt = new DataType();

			dt.appendTransformer([
				value => {
					return value.set(`inside ${value.get()} inside`);
				},
				value => {
					return value
						.set(`outside ${value.get()} outside`)
						.resolve();
				}
			]);

			it('transforms "value" into "outside inside value inside outside"', () => {
				assert.equal(dt.transform('value'), 'outside inside value inside outside');
			});
		});
	});

	describe('DataTypeFactory', () => {
		describe('createDateAndTime', () => {
			for(let className of ['Date', 'Time', 'Datetime', 'Timestamp', 'Year']) {
				it(className, () => {
					assert.instanceOf(DataTypeFactory[`create${className}`](className), DateAndTimeType[className]);
				});
			}
		});

		describe('createNumeric', () => {
			for(let className of ['TinyInt', 'SmallInt', 'MediumInt', 'Int', 'BigInt']) {
				it(className, () => {
					assert.instanceOf(DataTypeFactory[`create${className}`](className), NumericType[className]);
				});
			}
		});

		describe('createString', () => {
			for(let className of ['Char', 'Varchar']) {
				it(className, () => {
					assert.instanceOf(DataTypeFactory[`create${className}`](className), StringType[className]);
				});
			}
		});
	});
});
