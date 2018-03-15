const
	assert = require('chai').assert,
	{ DataTypeFactory } = require('../libraries/data-types/data-type'),

	// 참조 https://dev.mysql.com/doc/refman/5.7/en/integer-types.html
	NUMERIC_DATATYPE_MAX_RANGES = {
		TinyInt: {
			MAX: 128,
			MIN: -128,
			OVERFLOWED: 129,
			UNDERFLOWED: -129,
			UNSIGNED_MAX: 255,
			UNSIGNED_MIN: 0,
			UNSIGNED_OVERFLOWED: 256,
			UNSIGNED_UNDERFLOWED: -1
		},
		SmallInt: {
			MAX: 32768,
			MIN: -32768,
			OVERFLOWED: 32769,
			UNDERFLOWED: -32769,
			UNSIGNED_MAX: 65535,
			UNSIGNED_MIN: 0,
			UNSIGNED_OVERFLOWED: 65536,
			UNSIGNED_UNDERFLOWED: -1
		},
		MediumInt: {
			MAX: 8388608,
			MIN: -8388608,
			OVERFLOWED: 8388609,
			UNDERFLOWED: -8388609,
			UNSIGNED_MAX: 16777215,
			UNSIGNED_MIN: 0,
			UNSIGNED_OVERFLOWED: 16777216,
			UNSIGNED_UNDERFLOWED: -1
		},
		Int: {
			MAX: 2147483648,
			MIN: -2147483648,
			OVERFLOWED: 2147483649,
			UNDERFLOWED: -2147483649,
			UNSIGNED_MAX: 4294967295,
			UNSIGNED_MIN: 0,
			UNSIGNED_OVERFLOWED: 4294967296,
			UNSIGNED_UNDERFLOWED: -1
		},
		// BigInt의 경우 mysql의 range는 (+-)2^63 - 1이지만
		// javascript의 정수 표현 한계는 (+-)2^53 - 1이므로 여기에 따른다.
		BigInt: {
			MAX: Number.MAX_SAFE_INTEGER,
			MIN: Number.MAX_SAFE_INTEGER * -1,
			OVERFLOWED: Number.MAX_SAFE_INTEGER + 1,
			UNDERFLOWED: (Number.MAX_SAFE_INTEGER * -1) - 1,
			UNSIGNED_MAX: Number.MAX_SAFE_INTEGER,
			UNSIGNED_MIN: 0,
			UNSIGNED_OVERFLOWED: Number.MAX_SAFE_INTEGER + 1,
			UNSIGNED_UNDERFLOWED: -1
		}
	};

describe('numeric.js', () => {
	for(const [key, value] of Object.entries(NUMERIC_DATATYPE_MAX_RANGES)) {
		const { MAX, MIN, OVERFLOWED, UNDERFLOWED, UNSIGNED_MAX, UNSIGNED_MIN, UNSIGNED_OVERFLOWED, UNSIGNED_UNDERFLOWED } = value;

		describe(key, () => {
			describe('isStrictMode true, isUnsigned false', () => {
				const int = DataTypeFactory[`create${key}`]();

				describe('Check default values', () => {
					it('isStrictMode()', () => {
						assert.isTrue(int.isStrictMode());
					});
	
					it('isNotNull()', () => {
						assert.isFalse(int.isNotNull());
					});
	
					it('isBinary()', () => {
						assert.isFalse(int.isBinary());
					});
	
					it('isUnsigned()', () => {
						assert.isFalse(int.isUnsigned());
					});
	
					it('isZeroFill()', () => {
						assert.isFalse(int.isZeroFill());
					});
	
					it('getDateFormat()', () => {
						assert.deepEqual(int.getRanges(), {
							MIN: MIN,
							MAX: MAX
						});
					});
				});

				describe('Validate', () => {
					it('validates 1', () => {
						assert.isTrue(int.validate(1));
					});

					it('validates "1"', () => {
						assert.isFalse(int.validate('1'));
					});

					it('validates "가"', () => {
						assert.isFalse(int.validate('가'));
					});

					it('validates MAX value', () => {
						assert.isTrue(int.validate(MAX));
					});

					it('validates MIN value', () => {
						assert.isTrue(int.validate(MIN));
					});

					it('validates OVERFLOWED value', () => {
						assert.isFalse(int.validate(OVERFLOWED));
					});

					it('validates UNDERFLOWED value', () => {
						assert.isFalse(int.validate(UNDERFLOWED));
					});
				});

				describe('Transform', () => {
					it('transforms 1 into 1', () => {
						assert.strictEqual(int.transform(1), 1);
					});

					it('transforms "가" throws TypeError', () => {
						assert.throws(() => int.transform('가'), TypeError);
					});

					it('transforms "1" throws TypeError', () => {
						assert.throws(() => int.transform('1'), TypeError);
					});

					it('transforms MAX into MAX', () => {
						assert.strictEqual(int.transform(MAX), MAX);
					});

					it('transforms MIN into MIN', () => {
						assert.strictEqual(int.transform(MIN), MIN);
					});

					it('transforms OVERFLOWED throws TypeError', () => {
						assert.throws(() => int.transform(OVERFLOWED), TypeError);
					});

					it('transforms UNDERFLOWED throws TypeError', () => {
						assert.throws(() => int.transform(UNDERFLOWED), TypeError);
					});
				});
			});

			describe('isStrictMode false, isUnsigned false', () => {
				const int = DataTypeFactory[`create${key}`]({
						isStrictMode: false,
						isUnsigned: false
					});

				describe('Check default values', () => {
					it('isStrictMode()', () => {
						assert.isFalse(int.isStrictMode());
					});
	
					it('isNotNull()', () => {
						assert.isFalse(int.isNotNull());
					});
	
					it('isBinary()', () => {
						assert.isFalse(int.isBinary());
					});
	
					it('isUnsigned()', () => {
						assert.isFalse(int.isUnsigned());
					});
	
					it('isZeroFill()', () => {
						assert.isFalse(int.isZeroFill());
					});
	
					it('getDateFormat()', () => {
						assert.deepEqual(int.getRanges(), {
							MIN: MIN,
							MAX: MAX
						});
					});
				});

				describe('Validate', () => {
					it('validates 1', () => {
						assert.isTrue(int.validate(1));
					});

					it('validates "1"', () => {
						assert.isTrue(int.validate('1'));
					});

					it('validates "가"', () => {
						assert.isTrue(int.validate('가'));
					});

					it('validates MAX value', () => {
						assert.isTrue(int.validate(MAX));
					});

					it('validates MIN value', () => {
						assert.isTrue(int.validate(MIN));
					});

					it('validates OVERFLOWED value', () => {
						assert.isTrue(int.validate(OVERFLOWED));
					});

					it('validates UNDERFLOWED value', () => {
						assert.isTrue(int.validate(UNDERFLOWED));
					});
				});

				describe('Transform', () => {
					it('transforms 1 into 1', () => {
						assert.strictEqual(int.transform(1), 1);
					});

					it('transforms "가" into 0', () => {
						assert.strictEqual(int.transform('가'), 0);
					});

					it('transforms "1" into 1', () => {
						assert.strictEqual(int.transform('1'), 1);
					});

					it('transforms MAX into MAX', () => {
						assert.strictEqual(int.transform(MAX), MAX);
					});

					it('transforms MIN into MIN', () => {
						assert.strictEqual(int.transform(MIN), MIN);
					});

					it('transforms OVERFLOWED into MAX', () => {
						assert.strictEqual(int.transform(OVERFLOWED), MAX);
					});

					it('transforms UNDERFLOWED into MIN', () => {
						assert.strictEqual(int.transform(UNDERFLOWED), MIN);
					});
				});
			});

			describe('isStrictMode false, isUnsigned true', () => {
				const int = DataTypeFactory[`create${key}`]({
						isStrictMode: false,
						isUnsigned: true
					});

				describe('Check default values', () => {
					it('isStrictMode()', () => {
						assert.isFalse(int.isStrictMode());
					});
	
					it('isNotNull()', () => {
						assert.isFalse(int.isNotNull());
					});
	
					it('isBinary()', () => {
						assert.isFalse(int.isBinary());
					});
	
					it('isUnsigned()', () => {
						assert.isTrue(int.isUnsigned());
					});
	
					it('isZeroFill()', () => {
						assert.isFalse(int.isZeroFill());
					});
	
					it('getDateFormat()', () => {
						assert.deepEqual(int.getRanges(), {
							MIN: UNSIGNED_MIN,
							MAX: UNSIGNED_MAX
						});
					});
				});

				describe('Validate', () => {
					it('validates 1', () => {
						assert.isTrue(int.validate(1));
					});

					it('validates "1"', () => {
						assert.isTrue(int.validate('1'));
					});

					it('validates "가"', () => {
						assert.isTrue(int.validate('가'));
					});

					it('validates UNSIGNED_MAX value', () => {
						assert.isTrue(int.validate(UNSIGNED_MAX));
					});

					it('validates UNSIGNED_MIN', () => {
						assert.isTrue(int.validate(UNSIGNED_MIN));
					});

					it('validates UNSIGNED_OVERFLOWED value', () => {
						assert.isTrue(int.validate(UNSIGNED_OVERFLOWED));
					});

					it('validates UNSIGNED_UNDERFLOWED value', () => {
						assert.isTrue(int.validate(UNSIGNED_UNDERFLOWED));
					});
				});

				describe('Transform', () => {
					it('transforms 1 into 1', () => {
						assert.strictEqual(int.transform(1), 1);
					});

					it('transforms "가" into 1', () => {
						assert.strictEqual(int.transform('가'), 0);
					});

					it('transforms "1" into 1', () => {
						assert.strictEqual(int.transform('1'), 1);
					});

					it('transforms UNSIGNED_MAX into UNSIGNED_MAX', () => {
						assert.strictEqual(int.transform(UNSIGNED_MAX), UNSIGNED_MAX);
					});

					it('transforms UNSIGNED_MIN into UNSIGNED_MIN', () => {
						assert.strictEqual(int.transform(UNSIGNED_MIN), UNSIGNED_MIN);
					});

					it('transforms UNSIGNED_OVERFLOWED into UNSIGNED_MAX', () => {
						assert.strictEqual(int.transform(UNSIGNED_OVERFLOWED), UNSIGNED_MAX);
					});

					it('transforms UNSIGNED_UNDERFLOWED into UNSIGNED_MIN', () => {
						assert.strictEqual(int.transform(UNSIGNED_UNDERFLOWED), UNSIGNED_MIN);
					});
				});
			});

			describe('isStrictMode true, isUnsigned true', () => {
				const int = DataTypeFactory[`create${key}`]({
						isStrictMode: true,
						isUnsigned: true
					});

				describe('Check default values', () => {
					it('isStrictMode()', () => {
						assert.isTrue(int.isStrictMode());
					});
	
					it('isNotNull()', () => {
						assert.isFalse(int.isNotNull());
					});
	
					it('isBinary()', () => {
						assert.isFalse(int.isBinary());
					});
	
					it('isUnsigned()', () => {
						assert.isTrue(int.isUnsigned());
					});
	
					it('isZeroFill()', () => {
						assert.isFalse(int.isZeroFill());
					});
	
					it('getDateFormat()', () => {
						assert.deepEqual(int.getRanges(), {
							MIN: UNSIGNED_MIN,
							MAX: UNSIGNED_MAX
						});
					});
				});

				describe('Validate', () => {
					it('validates 1', () => {
						assert.isTrue(int.validate(1));
					});

					it('validates "1"', () => {
						assert.isFalse(int.validate('1'));
					});

					it('validates "가"', () => {
						assert.isFalse(int.validate('가'));
					});

					it('validates UNSIGNED_MAX value', () => {
						assert.isTrue(int.validate(UNSIGNED_MAX));
					});

					it('validates UNSIGNED_MIN', () => {
						assert.isTrue(int.validate(UNSIGNED_MIN));
					});

					it('validates UNSIGNED_OVERFLOWED value', () => {
						assert.isFalse(int.validate(UNSIGNED_OVERFLOWED));
					});

					it('validates UNSIGNED_UNDERFLOWED value', () => {
						assert.isFalse(int.validate(UNSIGNED_UNDERFLOWED));
					});
				});

				describe('Transform', () => {
					it('transforms 1 into 1', () => {
						assert.strictEqual(int.transform(1), 1);
					});

					it('transforms "가" throws TypeError', () => {
						assert.throws(() => int.transform('가'), TypeError);
					});

					it('transforms "1" throws TypeError', () => {
						assert.throws(() => int.transform('1'), TypeError);
					});

					it('transforms UNSIGNED_MAX into UNSIGNED_MAX', () => {
						assert.strictEqual(int.transform(UNSIGNED_MAX), UNSIGNED_MAX);
					});

					it('transforms UNSIGNED_MIN into UNSIGNED_MIN', () => {
						assert.strictEqual(int.transform(UNSIGNED_MIN), UNSIGNED_MIN);
					});

					it('transforms UNSIGNED_OVERFLOWED throws TypeError', () => {
						assert.throws(() => int.transform(UNSIGNED_OVERFLOWED), TypeError);
					});

					it('transforms UNSIGNED_UNDERFLOWED throws TypeError', () => {
						assert.throws(() => int.transform(UNSIGNED_UNDERFLOWED), TypeError);
					});
				});
			});
		});
	};
});
