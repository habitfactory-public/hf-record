const
	assert = require('chai').assert,
	{ DataType, DataTypeFactory } = require('../../libraries/data-types/data-type'),
	DateAndTimeType = require('../../libraries/data-types/date-and-time'),
	NumericType = require('../../libraries/data-types/numeric'),
	StringType = require('../../libraries/data-types/string');

describe('data-type.js', () => {
	describe('DataType', () => {
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

			dataType.addValidator([
				value => {
					return value <= 20 && value >= 10;
				},
				value => {
					return value === '가';
				}
			]);

			it('validates 5', () => {
				assert.isFalse(dataType.validate(5));
			});

			it('validates 15', () => {
				assert.isTrue(dataType.validate(15));
			});

			it('validates "가"', () => {
				assert.isTrue(dataType.validate('가'));
			});

			it('validates "나"', () => {
				assert.isFalse(dataType.validate('나'));
			});
		});

		describe('Transformer', () => {
			const dataType = new DataType();

			dataType.addTransformer([
				value => {
					return `inside ${value} inside`;
				},
				value => {
					return `outside ${value} outside`;
				}
			]);

			it('transforms "value" into "outside inside value inside outside"', () => {
				assert.equal(dataType.transform('value'), 'outside inside value inside outside');
			});
		});
	});

	describe('DataTypeFactory', () => {
		describe('createDateAndTime', () => {
			for(let className of ['Date', 'Time', 'Datetime', 'Timestamp', 'Year']) {
				it(className, () => {
					assert.instanceOf(DataTypeFactory.createDateAndTime(className), DateAndTimeType[className]);
				});
			}
		});

		describe('createNumeric', () => {
			for(let className of ['TinyInt', 'SmallInt', 'MediumInt', 'Int', 'BigInt']) {
				it(className, () => {
					assert.instanceOf(DataTypeFactory.createNumeric(className), NumericType[className]);
				});
			}
		});

		describe('createString', () => {
			for(let className of ['Char', 'Varchar']) {
				it(className, () => {
					assert.instanceOf(DataTypeFactory.createString(className), StringType[className]);
				});
			}
		});
	});
});
