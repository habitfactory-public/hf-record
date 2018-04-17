const
	assert = require('chai').assert,
	moment = require('moment'),
	{ DataTypeFactory } = require('../libraries/data-types/data-type');

describe('date-and-time.js', () => {
	// TODO
	// '1000-01-01' - '9999-12-31' 범위 테스트 추가해야함
	describe('Date', () => {
		describe('isStrictMode true', () => {
			const dt = DataTypeFactory.createDate();

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

				it('getDateFormat()', () => {
					assert.strictEqual(dt.getDateFormat(), 'YYYY-MM-DD');
				});
			});

			it('transforms "1979-07-07" into "1979-07-07"', () => {
				assert.strictEqual(dt.transform('1979-07-07'), '1979-07-07');
			});

			it('transforms "79-07-07" throws TypeError', () => {
				assert.throws(() => dt.transform('79-07-07'), TypeError);
			});

			it('transforms "19790707" throws TypeError', () => {
				assert.throws(() => dt.transform('19790707'), TypeError);
			});

			it('transforms new Date("1979-07-07") into "1979-07-07"', () => {
				assert.strictEqual(dt.transform(new Date('1979-07-07')), '1979-07-07');
			});

			it('transforms 1520407847000 into "2018-03-07"', () => {
				assert.strictEqual(dt.transform(1520407847000), '2018-03-07');
			});

			it('transforms 1520407847 into "2018-03-07"', () => {
				assert.strictEqual(dt.transform(1520407847), '2018-03-07');
			});

			it('transforms "1520407847000" throws TypeError', () => {
				assert.throws(() => dt.transform("1520407847000"), TypeError);
			});

			it('transforms "1520407847" throws TypeError', () => {
				assert.throws(() => dt.transform("1520407847"), TypeError);
			});

			it('transforms -1520407847000 throws TypeError', () => {
				assert.throws(() => dt.transform(-1520407847000), TypeError);
			});

			it('transforms -1520407847 throws TypeError', () => {
				assert.throws(() => dt.transform(-1520407847), TypeError);
			});

			it('validates "1979-07-07"', () => {
				assert.isTrue(dt.validate('1979-07-07'));
			});

			it('validates "79-07-07"', () => {
				assert.isFalse(dt.validate('79-07-07'));
			});

			it('validates "19790707"', () => {
				assert.isFalse(dt.validate('19790707'));
			});

			it('validates new Date("1979-07-07")', () => {
				assert.isTrue(dt.validate(new Date("1979-07-07")));
			});

			it('validates 152040784700', () => {
				assert.isTrue(dt.validate(1520407847000));
			});

			it('validates 1520407847', () => {
				assert.isTrue(dt.validate(1520407847));
			});

			it('validates "1520407847000"', () => {
				assert.isFalse(dt.validate("1520407847000"));
			});

			it('validates "1520407847"', () => {
				assert.isFalse(dt.validate("1520407847"));
			});

			it('validates -152040784700', () => {
				assert.isFalse(dt.validate(-1520407847000));
			});

			it('validates -1520407847', () => {
				assert.isFalse(dt.validate(-1520407847));
			});
		});

		describe('isStrictMode false', () => {
			const dt = DataTypeFactory.createDate({
					isStrictMode: false
				});

				describe('Check default values', () => {
					it('isStrictMode()', () => {
						assert.isFalse(dt.isStrictMode());
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
	
					it('getDateFormat()', () => {
						assert.strictEqual(dt.getDateFormat(), 'YYYY-MM-DD');
					});
				});

			it('transforms "1979-07-07" into "1979-07-07"', () => {
				assert.strictEqual(dt.transform('1979-07-07'), '1979-07-07');
			});

			it('transforms "79-07-07" into "0"', () => {
				assert.strictEqual(dt.transform('79-07-07'), '0');
			});

			it('transforms "19790707" into "0"', () => {
				assert.strictEqual(dt.transform('19790707'), '0');
			});

			it('transforms new Date("1979-07-07") into "1979-07-07"', () => {
				assert.strictEqual(dt.transform(new Date('1979-07-07')), '1979-07-07');
			});

			it('transforms 1520407847000 into "2018-03-07"', () => {
				assert.strictEqual(dt.transform(1520407847000), '2018-03-07');
			});

			it('transforms 1520407847 into "2018-03-07"', () => {
				assert.strictEqual(dt.transform(1520407847), '2018-03-07');
			});

			it('transforms "1520407847000" into "0"', () => {
				assert.strictEqual(dt.transform("1520407847000"), '0');
			});

			it('transforms "1520407847" into "0"', () => {
				assert.strictEqual(dt.transform("1520407847"), '0');
			});

			it('transforms -1520407847000 into "0"', () => {
				assert.strictEqual(dt.transform(-1520407847000), '0');
			});

			it('transforms -1520407847 into "0"', () => {
				assert.strictEqual(dt.transform(-1520407847), '0');
			});

			it('validates "1979-07-07"', () => {
				assert.isTrue(dt.validate('1979-07-07'));
			});

			it('validates "79-07-07"', () => {
				assert.isTrue(dt.validate('79-07-07'));
			});

			it('validates "19790707"', () => {
				assert.isTrue(dt.validate('19790707'));
			});

			it('validates new Date("1979-07-07")', () => {
				assert.isTrue(dt.validate(new Date('1979-07-07')));
			});

			it('validates 152040784700', () => {
				assert.isTrue(dt.validate(1520407847000));
			});

			it('validates 1520407847', () => {
				assert.isTrue(dt.validate(1520407847));
			});

			it('validates "1520407847000"', () => {
				assert.isTrue(dt.validate("1520407847000"));
			});

			it('validates "1520407847"', () => {
				assert.isTrue(dt.validate("1520407847"));
			});

			it('validates -152040784700', () => {
				assert.isTrue(dt.validate(-1520407847000));
			});

			it('validates -1520407847', () => {
				assert.isTrue(dt.validate(-1520407847));
			});
		});
	});

	// TODO
	// '-838:59:59' - '838:59:59' 범위 체크 추가해야함.
	describe('Time', () => {
		describe('isStrictMode true', () => {
			const dt = DataTypeFactory.createTime();

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

				it('getDateFormat()', () => {
					assert.strictEqual(dt.getDateFormat(), 'HH:mm:ss');
				});
			});

			it('transforms "12:23:34" into "12:23:34"', () => {
				assert.strictEqual(dt.transform('12:23:34'), '12:23:34');
			});

			it('transforms "122334" throws TypeError', () => {
				assert.throws(() => dt.transform('122334'), TypeError);
			});

			it('transforms new Date("1979-07-07 12:23:34") into "12:23:34"', () => {
				assert.strictEqual(dt.transform(new Date('1979-07-07 12:23:34')), '12:23:34');
			});

			it('transforms 1520407847000 into "16:30:47"', () => {
				assert.strictEqual(dt.transform(1520407847000), '16:30:47');
			});

			it('transforms 1520407847 into "16:30:47"', () => {
				assert.strictEqual(dt.transform(1520407847), '16:30:47');
			});

			it('transforms "1520407847000" throws TypeError', () => {
				assert.throws(() => dt.transform("1520407847000"), TypeError);
			});

			it('transforms "1520407847" throws TypeError', () => {
				assert.throws(() => dt.transform("1520407847"), TypeError);
			});

			it('transforms -1520407847000 throws TypeError', () => {
				assert.throws(() => dt.transform(-1520407847000), TypeError);
			});

			it('transforms -1520407847 throws TypeError', () => {
				assert.throws(() => dt.transform(-1520407847), TypeError);
			});

			it('validates "12:23:34"', () => {
				assert.isTrue(dt.validate('12:23:34'));
			});

			it('validates "122334"', () => {
				assert.isFalse(dt.validate('122334'));
			});

			it('validates new Date("1979-07-07 12:23:34")', () => {
				assert.isTrue(dt.validate(new Date("1979-07-07 12:23:34")));
			});

			it('validates 152040784700', () => {
				assert.isTrue(dt.validate(1520407847000));
			});

			it('validates 1520407847', () => {
				assert.isTrue(dt.validate(1520407847));
			});

			it('validates "1520407847000"', () => {
				assert.isFalse(dt.validate("1520407847000"));
			});

			it('validates "1520407847"', () => {
				assert.isFalse(dt.validate("1520407847"));
			});

			it('validates -152040784700', () => {
				assert.isFalse(dt.validate(-1520407847000));
			});

			it('validates -1520407847', () => {
				assert.isFalse(dt.validate(-1520407847));
			});
		});

		describe('isStrictMode false', () => {
			const dt = DataTypeFactory.createTime({
					isStrictMode: false
				});

			describe('Check default values', () => {
				it('isStrictMode()', () => {
					assert.isFalse(dt.isStrictMode());
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

				it('getDateFormat()', () => {
					assert.strictEqual(dt.getDateFormat(), 'HH:mm:ss');
				});
			});

			it('transforms "12:23:34" into "12:23:34"', () => {
				assert.strictEqual(dt.transform('12:23:34'), '12:23:34');
			});

			it('transforms "122334" into "0"', () => {
				assert.strictEqual(dt.transform('122334'), '0');
			});

			it('transforms new Date("1979-07-07 12:23:34") into "12:23:34"', () => {
				assert.strictEqual(dt.transform(new Date('1979-07-07 12:23:34')), '12:23:34');
			});

			it('transforms 1520407847000 into "16:30:47"', () => {
				assert.strictEqual(dt.transform(1520407847000), '16:30:47');
			});

			it('transforms 1520407847 into "16:30:47"', () => {
				assert.strictEqual(dt.transform(1520407847), '16:30:47');
			});

			it('transforms "1520407847000" into "0"', () => {
				assert.strictEqual(dt.transform("1520407847000"), '0');
			});

			it('transforms "1520407847" into "0"', () => {
				assert.strictEqual(dt.transform("1520407847"), '0');
			});

			it('transforms -1520407847000 into "0"', () => {
				assert.strictEqual(dt.transform(-1520407847000), '0');
			});

			it('transforms -1520407847 into "0"', () => {
				assert.strictEqual(dt.transform(-1520407847), '0');
			});

			it('validates "12:23:34"', () => {
				assert.isTrue(dt.validate('12:23:34'));
			});

			it('validates "122334"', () => {
				assert.isTrue(dt.validate('122334'));
			});

			it('validates new Date("1979-07-07 12:23:34")', () => {
				assert.isTrue(dt.validate(new Date("1979-07-07 12:23:34")));
			});

			it('validates 152040784700', () => {
				assert.isTrue(dt.validate(1520407847000));
			});

			it('validates 1520407847', () => {
				assert.isTrue(dt.validate(1520407847));
			});

			it('validates "1520407847000"', () => {
				assert.isTrue(dt.validate("1520407847000"));
			});

			it('validates "1520407847"', () => {
				assert.isTrue(dt.validate("1520407847"));
			});

			it('validates -152040784700', () => {
				assert.isTrue(dt.validate(-1520407847000));
			});

			it('validates -1520407847', () => {
				assert.isTrue(dt.validate(-1520407847));
			});
		});
	});

	// TODO
	// '1000-01-01 00:00:00' - '9999-12-31 23:59:59' 범위 체크 추가해야함.
	describe('Datetime', () => {
		describe('isStrictMode true', () => {
			const dt = DataTypeFactory.createDatetime();

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

				it('getDateFormat()', () => {
					assert.strictEqual(dt.getDateFormat(), 'YYYY-MM-DD HH:mm:ss');
				});
			});

			it('transforms "1979-07-07 12:23:34" into "1979-07-07 12:23:34"', () => {
				assert.strictEqual(dt.transform('1979-07-07 12:23:34'), '1979-07-07 12:23:34');
			});

			it('transforms "19790707122334" throws TypeError', () => {
				assert.throws(() => dt.transform('19790707122334'), TypeError);
			});

			it('transforms new Date("1979-07-07 12:23:34") into "1979-07-07 12:23:34"', () => {
				assert.strictEqual(dt.transform(new Date('1979-07-07 12:23:34')), '1979-07-07 12:23:34');
			});

			it('transforms 1520407847000 into "2018-03-07 16:30:47"', () => {
				assert.strictEqual(dt.transform(1520407847000), '2018-03-07 16:30:47');
			});

			it('transforms 1520407847 into "2018-03-07 16:30:47"', () => {
				assert.strictEqual(dt.transform(1520407847), '2018-03-07 16:30:47');
			});

			it('transforms "1520407847000" throws TypeError', () => {
				assert.throws(() => dt.transform("1520407847000"), TypeError);
			});

			it('transforms "1520407847" throws TypeError', () => {
				assert.throws(() => dt.transform("1520407847"), TypeError);
			});

			it('transforms -1520407847000 throws TypeError', () => {
				assert.throws(() => dt.transform(-1520407847000), TypeError);
			});

			it('transforms -1520407847 throws TypeError', () => {
				assert.throws(() => dt.transform(-1520407847), TypeError);
			});

			it('validates "1979-07-07 12:23:34"', () => {
				assert.isTrue(dt.validate('1979-07-07 12:23:34'));
			});

			it('validates "19790707122334"', () => {
				assert.isFalse(dt.validate('19790707122334'));
			});

			it('validates new Date("1979-07-07 12:23:34")', () => {
				assert.isTrue(dt.validate(new Date("1979-07-07 12:23:34")));
			});

			it('validates 152040784700', () => {
				assert.isTrue(dt.validate(1520407847000));
			});

			it('validates 1520407847', () => {
				assert.isTrue(dt.validate(1520407847));
			});

			it('validates "1520407847000"', () => {
				assert.isFalse(dt.validate("1520407847000"));
			});

			it('validates "1520407847"', () => {
				assert.isFalse(dt.validate("1520407847"));
			});

			it('validates -152040784700', () => {
				assert.isFalse(dt.validate(-1520407847000));
			});

			it('validates -1520407847', () => {
				assert.isFalse(dt.validate(-1520407847));
			});
		});

		describe('isStrictMode false', () => {
			const dt = DataTypeFactory.createDatetime({
					isStrictMode: false
				});

			describe('Check default values', () => {
				it('isStrictMode()', () => {
					assert.isFalse(dt.isStrictMode());
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

				it('getDateFormat()', () => {
					assert.strictEqual(dt.getDateFormat(), 'YYYY-MM-DD HH:mm:ss');
				});
			});

			it('transforms "1979-07-07 12:23:34" into "1979-07-07 12:23:34"', () => {
				assert.strictEqual(dt.transform('1979-07-07 12:23:34'), '1979-07-07 12:23:34');
			});

			it('transforms "19790707122334" into "0"', () => {
				assert.strictEqual(dt.transform('19790707122334'), '0');
			});

			it('transforms new Date("1979-07-07 12:23:34") into "1979-07-07 12:23:34"', () => {
				assert.strictEqual(dt.transform(new Date('1979-07-07 12:23:34')), '1979-07-07 12:23:34');
			});

			it('transforms 1520407847000 into "2018-03-07 16:30:47"', () => {
				assert.strictEqual(dt.transform(1520407847000), '2018-03-07 16:30:47');
			});

			it('transforms 1520407847 into "2018-03-07 16:30:47"', () => {
				assert.strictEqual(dt.transform(1520407847), '2018-03-07 16:30:47');
			});

			it('transforms "1520407847000" into "0"', () => {
				assert.strictEqual(dt.transform("1520407847000"), '0');
			});

			it('transforms "1520407847" into "0"', () => {
				assert.strictEqual(dt.transform("1520407847"), '0');
			});

			it('transforms -1520407847000 into "0"', () => {
				assert.strictEqual(dt.transform(-1520407847000), '0');
			});

			it('transforms -1520407847 into "0"', () => {
				assert.strictEqual(dt.transform(-1520407847), '0');
			});

			it('validates "1979-07-07 12:23:34"', () => {
				assert.isTrue(dt.validate('1979-07-07 12:23:34'));
			});

			it('validates "19790707122334"', () => {
				assert.isTrue(dt.validate('19790707122334'));
			});

			it('validates new Date("1979-07-07 12:23:34")', () => {
				assert.isTrue(dt.validate(new Date("1979-07-07 12:23:34")));
			});

			it('validates 152040784700', () => {
				assert.isTrue(dt.validate(1520407847000));
			});

			it('validates 1520407847', () => {
				assert.isTrue(dt.validate(1520407847));
			});

			it('validates "1520407847000"', () => {
				assert.isTrue(dt.validate("1520407847000"));
			});

			it('validates "1520407847"', () => {
				assert.isTrue(dt.validate("1520407847"));
			});

			it('validates -152040784700', () => {
				assert.isTrue(dt.validate(-1520407847000));
			});

			it('validates -1520407847', () => {
				assert.isTrue(dt.validate(-1520407847));
			});
		});
	});

	// TODO
	// '1970-01-01 00:00:01' UTC - '2038-01-19 03:14:07' UTC 범위 체크 추가해야함.
	describe('Timestamp', () => {
 		describe('isStrictMode true', () => {
			const dt = DataTypeFactory.createTimestamp();

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

				it('getDateFormat()', () => {
					assert.strictEqual(dt.getDateFormat(), 'YYYY-MM-DD HH:mm:ss');
				});
			});

 			it('transforms "1979-07-07 12:23:34" into "1979-07-07 12:23:34"', () => {
 				assert.strictEqual(dt.transform('1979-07-07 12:23:34'), '1979-07-07 12:23:34');
 			});

 			it('transforms "19790707122334" throws TypeError', () => {
 				assert.throws(() => dt.transform('19790707122334'), TypeError);
 			});

 			it('transforms new Date("1979-07-07 12:23:34") into "1979-07-07 12:23:34"', () => {
 				assert.strictEqual(dt.transform(new Date('1979-07-07 12:23:34')), '1979-07-07 12:23:34');
 			});

 			it('transforms 1520407847000 into "2018-03-07 16:30:47"', () => {
 				assert.strictEqual(dt.transform(1520407847000), '2018-03-07 16:30:47');
 			});

 			it('transforms 1520407847 into "2018-03-07 16:30:47"', () => {
 				assert.strictEqual(dt.transform(1520407847), '2018-03-07 16:30:47');
 			});

 			it('transforms "1520407847000" throws TypeError', () => {
 				assert.throws(() => dt.transform("1520407847000"), TypeError);
 			});

 			it('transforms "1520407847" throws TypeError', () => {
 				assert.throws(() => dt.transform("1520407847"), TypeError);
 			});

 			it('transforms -1520407847000 throws TypeError', () => {
 				assert.throws(() => dt.transform(-1520407847000), TypeError);
 			});

 			it('transforms -1520407847 throws TypeError', () => {
 				assert.throws(() => dt.transform(-1520407847), TypeError);
 			});

 			it('validates "1979-07-07 12:23:34"', () => {
 				assert.isTrue(dt.validate('1979-07-07 12:23:34'));
 			});

 			it('validates "19790707122334"', () => {
 				assert.isFalse(dt.validate('19790707122334'));
 			});

 			it('validates new Date("1979-07-07 12:23:34")', () => {
 				assert.isTrue(dt.validate(new Date("1979-07-07 12:23:34")));
 			});

 			it('validates 152040784700', () => {
 				assert.isTrue(dt.validate(1520407847000));
 			});

 			it('validates 1520407847', () => {
 				assert.isTrue(dt.validate(1520407847));
 			});

 			it('validates "1520407847000"', () => {
 				assert.isFalse(dt.validate("1520407847000"));
 			});

 			it('validates "1520407847"', () => {
 				assert.isFalse(dt.validate("1520407847"));
 			});

 			it('validates -152040784700', () => {
 				assert.isFalse(dt.validate(-1520407847000));
 			});

 			it('validates -1520407847', () => {
 				assert.isFalse(dt.validate(-1520407847));
 			});
 		});

 		describe('isStrictMode false', () => {
			const dt = DataTypeFactory.createTimestamp({
 					isStrictMode: false
 				});

			describe('Check default values', () => {
				it('isStrictMode()', () => {
					assert.isFalse(dt.isStrictMode());
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

				it('getDateFormat()', () => {
					assert.strictEqual(dt.getDateFormat(), 'YYYY-MM-DD HH:mm:ss');
				});
			});

 			it('transforms "1979-07-07 12:23:34" into "1979-07-07 12:23:34"', () => {
 				assert.strictEqual(dt.transform('1979-07-07 12:23:34'), '1979-07-07 12:23:34');
 			});

 			it('transforms "19790707122334" into "0"', () => {
 				assert.strictEqual(dt.transform('19790707122334'), '0');
 			});

 			it('transforms new Date("1979-07-07 12:23:34") into "1979-07-07 12:23:34"', () => {
 				assert.strictEqual(dt.transform(new Date('1979-07-07 12:23:34')), '1979-07-07 12:23:34');
 			});

 			it('transforms 1520407847000 into "2018-03-07 16:30:47"', () => {
 				assert.strictEqual(dt.transform(1520407847000), '2018-03-07 16:30:47');
 			});

 			it('transforms 1520407847 into "2018-03-07 16:30:47"', () => {
 				assert.strictEqual(dt.transform(1520407847), '2018-03-07 16:30:47');
 			});

 			it('transforms "1520407847000" into "0"', () => {
 				assert.strictEqual(dt.transform("1520407847000"), '0');
 			});

 			it('transforms "1520407847" into "0"', () => {
 				assert.strictEqual(dt.transform("1520407847"), '0');
 			});

 			it('transforms -1520407847000 into "0"', () => {
 				assert.strictEqual(dt.transform(-1520407847000), '0');
 			});

 			it('transforms -1520407847 into "0"', () => {
 				assert.strictEqual(dt.transform(-1520407847), '0');
 			});

 			it('validates "1979-07-07 12:23:34"', () => {
 				assert.isTrue(dt.validate('1979-07-07 12:23:34'));
 			});

 			it('validates "19790707122334"', () => {
 				assert.isTrue(dt.validate('19790707122334'));
 			});

 			it('validates new Date("1979-07-07 12:23:34")', () => {
 				assert.isTrue(dt.validate(new Date("1979-07-07 12:23:34")));
 			});

 			it('validates 152040784700', () => {
 				assert.isTrue(dt.validate(1520407847000));
 			});

 			it('validates 1520407847', () => {
 				assert.isTrue(dt.validate(1520407847));
 			});

 			it('validates "1520407847000"', () => {
 				assert.isTrue(dt.validate("1520407847000"));
 			});

 			it('validates "1520407847"', () => {
 				assert.isTrue(dt.validate("1520407847"));
 			});

 			it('validates -152040784700', () => {
 				assert.isTrue(dt.validate(-1520407847000));
 			});

 			it('validates -1520407847', () => {
 				assert.isTrue(dt.validate(-1520407847));
 			});
 		});
 	});

	// TODO
	// '1901' - '2155' UTC 범위 체크 추가해야함.
	describe('Year', () => {
		describe('isStrictMode true', () => {
			const dt = DataTypeFactory.createYear();

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

				it('getDateFormat()', () => {
					assert.strictEqual(dt.getDateFormat(), 'YYYY');
				});
			});

			it('transforms "1979" into "1979"', () => {
 				assert.strictEqual(dt.transform('1979'), '1979');
 			});

			it('transforms "1901" into "1901"', () => {
 				assert.strictEqual(dt.transform('1901'), '1901');
 			});

			it('transforms "2155" into "2155"', () => {
 				assert.strictEqual(dt.transform('2155'), '2155');
 			});

			it('transforms "1900" throws TypeError', () => {
 				assert.throws(() => dt.transform('1900'), TypeError);
 			});

			it('transforms "2156" throws TypeError', () => {
 				assert.throws(() => dt.transform('2156'), TypeError);
 			});

 			it('transforms new Date("1979-07-07 12:23:34") into "1979"', () => {
 				assert.strictEqual(dt.transform(new Date('1979-07-07 12:23:34')), '1979');
 			});

 			it('transforms 1520407847000 into "2018"', () => {
 				assert.strictEqual(dt.transform(1520407847000), '2018');
 			});

 			it('transforms 1520407847 into "2018"', () => {
 				assert.strictEqual(dt.transform(1520407847), '2018');
 			});

 			it('transforms "1520407847000" throws TypeError', () => {
 				assert.throws(() => dt.transform("1520407847000"), TypeError);
 			});

 			it('transforms "1520407847" throws TypeError', () => {
 				assert.throws(() => dt.transform("1520407847"), TypeError);
 			});

 			it('transforms -1520407847000 throws TypeError', () => {
 				assert.throws(() => dt.transform(-1520407847000), TypeError);
 			});

 			it('transforms -1520407847 throws TypeError', () => {
 				assert.throws(() => dt.transform(-1520407847), TypeError);
 			});

			it('validates "1979"', () => {
 				assert.isTrue(dt.validate('1979'));
 			});

			it('validates "1901"', () => {
 				assert.isTrue(dt.validate('1901'));
 			});

			it('validates "2155"', () => {
 				assert.isTrue(dt.validate('2155'));
 			});

			it('validates "1900"', () => {
 				assert.isFalse(dt.validate('1900'));
 			});

			it('validates "2156"', () => {
 				assert.isFalse(dt.validate('2156'));
 			});

 			it('validates new Date("1979-07-07 12:23:34")', () => {
 				assert.isTrue(dt.validate(new Date("1979-07-07 12:23:34")));
 			});

 			it('validates 152040784700', () => {
 				assert.isTrue(dt.validate(1520407847000));
 			});

 			it('validates 1520407847', () => {
 				assert.isTrue(dt.validate(1520407847));
 			});

 			it('validates "1520407847000"', () => {
 				assert.isFalse(dt.validate("1520407847000"));
 			});

 			it('validates "1520407847"', () => {
 				assert.isFalse(dt.validate("1520407847"));
 			});

 			it('validates -152040784700', () => {
 				assert.isFalse(dt.validate(-1520407847000));
 			});

 			it('validates -1520407847', () => {
 				assert.isFalse(dt.validate(-1520407847));
 			});
		});

		describe('isStrictMode false', () => {
			const dt = DataTypeFactory.createYear({
					isStrictMode: false
				});

			describe('Check default values', () => {
				it('isStrictMode()', () => {
					assert.isFalse(dt.isStrictMode());
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

				it('getDateFormat()', () => {
					assert.strictEqual(dt.getDateFormat(), 'YYYY');
				});
			});

			it('transforms "1979" into "1979"', () => {
 				assert.strictEqual(dt.transform('1979'), '1979');
 			});

			it('transforms "1901" into "1901"', () => {
 				assert.strictEqual(dt.transform('1901'), '1901');
 			});

			it('transforms "2155" into "2155"', () => {
 				assert.strictEqual(dt.transform('2155'), '2155');
 			});

			it('transforms "1900" into "1901"', () => {
 				assert.strictEqual(dt.transform('1900'), '0');
 			});

			it('transforms "2156" into "2155"', () => {
 				assert.strictEqual(dt.transform('2156'), '0');
 			});

 			it('transforms new Date("1979-07-07 12:23:34") into "1979"', () => {
 				assert.strictEqual(dt.transform(new Date('1979-07-07 12:23:34')), '1979');
 			});

 			it('transforms 1520407847000 into "2018"', () => {
 				assert.strictEqual(dt.transform(1520407847000), '2018');
 			});

 			it('transforms 1520407847 into "2018"', () => {
 				assert.strictEqual(dt.transform(1520407847), '2018');
 			});

 			it('transforms "1520407847000" into "0"', () => {
 				assert.strictEqual(dt.transform("1520407847000"), '0');
 			});

 			it('transforms "1520407847" into "0"', () => {
 				assert.strictEqual(dt.transform("1520407847"), '0');
 			});

 			it('transforms -1520407847000 into "0"', () => {
 				assert.strictEqual(dt.transform(-1520407847000), '0');
 			});

 			it('transforms -1520407847 into "0"', () => {
 				assert.strictEqual(dt.transform(-1520407847), '0');
 			});

			it('validates "1979"', () => {
 				assert.isTrue(dt.validate('1979'));
 			});

			it('validates "1901"', () => {
 				assert.isTrue(dt.validate('1901'));
 			});

			it('validates "2155"', () => {
 				assert.isTrue(dt.validate('2155'));
 			});

			it('validates "1900"', () => {
 				assert.isTrue(dt.validate('1900'));
 			});

			it('validates "2156"', () => {
 				assert.isTrue(dt.validate('2156'));
 			});

 			it('validates new Date("1979-07-07 12:23:34")', () => {
 				assert.isTrue(dt.validate(new Date("1979-07-07 12:23:34")));
 			});

 			it('validates 152040784700', () => {
 				assert.isTrue(dt.validate(1520407847000));
 			});

 			it('validates 1520407847', () => {
 				assert.isTrue(dt.validate(1520407847));
 			});

 			it('validates "1520407847000"', () => {
 				assert.isTrue(dt.validate("1520407847000"));
 			});

 			it('validates "1520407847"', () => {
 				assert.isTrue(dt.validate("1520407847"));
 			});

 			it('validates -152040784700', () => {
 				assert.isTrue(dt.validate(-1520407847000));
 			});

 			it('validates -1520407847', () => {
 				assert.isTrue(dt.validate(-1520407847));
 			});
		});
	});
});
