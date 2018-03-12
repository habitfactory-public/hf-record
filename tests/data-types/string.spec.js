const
	assert = require('chai').assert,
	{ DataTypeFactory } = require('../../libraries/data-types/data-type');

// char length 0 - 255 (765byte)
// varchar length 0 - 21845 (65535byte)
describe('string.js', () => {
	describe('CHAR', () => {
		describe('StrictMode true, length 4', () => {
			const s = DataTypeFactory.createString('CHAR', {
					length: 4
				});

			it('checks default values', () => {
				assert.deepEqual(s.options, {
					strictMode: true,
					length: 4
				});
			});

			it('validates ""', () => {
				assert.isTrue(s.validate(''));
			});

			it('validates "   "', () => {
				assert.isTrue(s.validate('   '));
			});

			it('validates "    "', () => {
				assert.isTrue(s.validate('    '));
			});

			it('validates "     "', () => {
				assert.isTrue(s.validate('     '));
			});

			it('validates 0', () => {
				assert.isTrue(s.validate(0));
			});

			it('validates 123', () => {
				assert.isTrue(s.validate(123));
			});

			it('validates 1234', () => {
				assert.isTrue(s.validate(1234));
			});

			it('validates 12345', () => {
				assert.isFalse(s.validate(12345));
			});

			it('validates "abc"', () => {
				assert.isTrue(s.validate('abc'));
			});

			it('validates "안녕?"', () => {
				assert.isTrue(s.validate('안녕?'));
			});

			it('validates "가1a!"', () => {
				assert.isTrue(s.validate('가1a!'));
			});

			it('validates "가1a! "', () => {
				assert.isTrue(s.validate('가1a! '));
			});

			it('validates "가1a !"', () => {
				assert.isFalse(s.validate('가1a !'));
			});

			it('transforms "" into ""', () => {
				assert.strictEqual(s.transform(''), '');
			});

			it('transforms "   " into ""', () => {
				assert.strictEqual(s.transform('   '), '');
			});

			it('transforms "    " into ""', () => {
				assert.strictEqual(s.transform('    '), '');
			});

			it('transforms "     " into ""', () => {
				assert.strictEqual(s.transform('     '), '');
			});

			it('transforms 0 into "0"', () => {
				assert.strictEqual(s.transform(0), '0');
			});

			it('transforms 123 into "123"', () => {
				assert.strictEqual(s.transform(123), '123');
			});

			it('transforms 1234 into "1234"', () => {
				assert.strictEqual(s.transform(1234), '1234');
			});

			it('transforms 12345 throws TypeError', () => {
				assert.throws(() => s.transform(12345), TypeError);
			});

			it('transforms "abc" into "abc"', () => {
				assert.strictEqual(s.transform('abc'), 'abc');
			});

			it('transforms "안녕?" into "안녕?"', () => {
				assert.strictEqual(s.transform('안녕?'), '안녕?');
			});

			it('transforms "가1a!" into "가1a!"', () => {
				assert.strictEqual(s.transform('가1a!'), '가1a!');
			});

			it('transforms "가1a! " into "가1a!"', () => {
				assert.strictEqual(s.transform('가1a! '), '가1a!');
			});

			it('transforms "가1a !" throws TypeError', () => {
				assert.throws(() => s.transform('가1a !'), TypeError);
			});
		});

		describe('StrictMode false, length 4', () => {
			const s = DataTypeFactory.createString('CHAR', {
					strictMode: false,
					length: 4
				});

			it('checks default values', () => {
				assert.deepEqual(s.options, {
					strictMode: false,
					length: 4
				});
			});

			it('validates ""', () => {
				assert.isTrue(s.validate(''));
			});

			it('validates "   "', () => {
				assert.isTrue(s.validate('   '));
			});

			it('validates "    "', () => {
				assert.isTrue(s.validate('    '));
			});

			it('validates "     "', () => {
				assert.isTrue(s.validate('     '));
			});

			it('validates 0', () => {
				assert.isTrue(s.validate(0));
			});

			it('validates 123', () => {
				assert.isTrue(s.validate(123));
			});

			it('validates 1234', () => {
				assert.isTrue(s.validate(1234));
			});

			it('validates 12345', () => {
				assert.isTrue(s.validate(12345));
			});

			it('validates "abc"', () => {
				assert.isTrue(s.validate('abc'));
			});

			it('validates "안녕?"', () => {
				assert.isTrue(s.validate('안녕?'));
			});

			it('validates "가1a!"', () => {
				assert.isTrue(s.validate('가1a!'));
			});

			it('validates "가1a! "', () => {
				assert.isTrue(s.validate('가1a! '));
			});

			it('validates "가1a !"', () => {
				assert.isTrue(s.validate('가1a !'));
			});

			it('transforms "" into ""', () => {
				assert.strictEqual(s.transform(''), '');
			});

			it('transforms "   " into ""', () => {
				assert.strictEqual(s.transform('   '), '');
			});

			it('transforms "    " into ""', () => {
				assert.strictEqual(s.transform('    '), '');
			});

			it('transforms "     " into ""', () => {
				assert.strictEqual(s.transform('     '), '');
			});

			it('transforms 0 into "0"', () => {
				assert.strictEqual(s.transform(0), '0');
			});

			it('transforms 123 into "123"', () => {
				assert.strictEqual(s.transform(123), '123');
			});

			it('transforms 1234 into "1234"', () => {
				assert.strictEqual(s.transform(1234), '1234');
			});

			it('transforms 12345 into "1234"', () => {
				assert.strictEqual(s.transform(12345), '1234');
			});

			it('transforms "abc" into "abc"', () => {
				assert.strictEqual(s.transform('abc'), 'abc');
			});

			it('transforms "안녕?" into "안녕?"', () => {
				assert.strictEqual(s.transform('안녕?'), '안녕?');
			});

			it('transforms "가1a!" into "가1a!"', () => {
				assert.strictEqual(s.transform('가1a!'), '가1a!');
			});

			it('transforms "가1a! " into "가1a!"', () => {
				assert.strictEqual(s.transform('가1a! '), '가1a!');
			});

			it('transforms "가1a !" into "가1a"', () => {
				assert.strictEqual(s.transform('가1a !'), '가1a');
			});
		});
	});

	describe('VARCHAR', () => {
		describe('StrictMode true, length 4', () => {
			const s = DataTypeFactory.createString('VARCHAR', {
					length: 4
				});

			it('checks default values', () => {
				assert.deepEqual(s.options, {
					strictMode: true,
					length: 4
				});
			});

			it('validates ""', () => {
				assert.isTrue(s.validate(''));
			});

			it('validates "   "', () => {
				assert.isTrue(s.validate('   '));
			});

			it('validates "    "', () => {
				assert.isTrue(s.validate('    '));
			});

			it('validates "     "', () => {
				assert.isTrue(s.validate('     '));
			});

			it('validates 0', () => {
				assert.isTrue(s.validate(0));
			});

			it('validates 123', () => {
				assert.isTrue(s.validate(123));
			});

			it('validates 1234', () => {
				assert.isTrue(s.validate(1234));
			});

			it('validates 12345', () => {
				assert.isFalse(s.validate(12345));
			});

			it('validates "abc"', () => {
				assert.isTrue(s.validate('abc'));
			});

			it('validates "안녕?"', () => {
				assert.isTrue(s.validate('안녕?'));
			});

			it('validates "가1a!"', () => {
				assert.isTrue(s.validate('가1a!'));
			});

			it('validates "가1a! "', () => {
				assert.isTrue(s.validate('가1a! '));
			});

			it('validates "가1a !"', () => {
				assert.isFalse(s.validate('가1a !'));
			});

			it('transforms "" into ""', () => {
				assert.strictEqual(s.transform(''), '');
			});

			it('transforms "   " into ""', () => {
				assert.strictEqual(s.transform('   '), '');
			});

			it('transforms "    " into ""', () => {
				assert.strictEqual(s.transform('    '), '');
			});

			it('transforms "     " into ""', () => {
				assert.strictEqual(s.transform('     '), '');
			});

			it('transforms 0 into "0"', () => {
				assert.strictEqual(s.transform(0), '0');
			});

			it('transforms 123 into "123"', () => {
				assert.strictEqual(s.transform(123), '123');
			});

			it('transforms 1234 into "1234"', () => {
				assert.strictEqual(s.transform(1234), '1234');
			});

			it('transforms 12345 throws TypeError', () => {
				assert.throws(() => s.transform(12345), TypeError);
			});

			it('transforms "abc" into "abc"', () => {
				assert.strictEqual(s.transform('abc'), 'abc');
			});

			it('transforms "안녕?" into "안녕?"', () => {
				assert.strictEqual(s.transform('안녕?'), '안녕?');
			});

			it('transforms "가1a!" into "가1a!"', () => {
				assert.strictEqual(s.transform('가1a!'), '가1a!');
			});

			it('transforms "가1a! " into "가1a!"', () => {
				assert.strictEqual(s.transform('가1a! '), '가1a!');
			});

			it('transforms "가1a !" throws TypeError', () => {
				assert.throws(() => s.transform('가1a !'), TypeError);
			});
		});

		describe('StrictMode false, length 4', () => {
			const s = DataTypeFactory.createString('VARCHAR', {
					strictMode: false,
					length: 4
				});

			it('checks default values', () => {
				assert.deepEqual(s.options, {
					strictMode: false,
					length: 4
				});
			});

			it('validates ""', () => {
				assert.isTrue(s.validate(''));
			});

			it('validates "   "', () => {
				assert.isTrue(s.validate('   '));
			});

			it('validates "    "', () => {
				assert.isTrue(s.validate('    '));
			});

			it('validates "     "', () => {
				assert.isTrue(s.validate('     '));
			});

			it('validates 0', () => {
				assert.isTrue(s.validate(0));
			});

			it('validates 123', () => {
				assert.isTrue(s.validate(123));
			});

			it('validates 1234', () => {
				assert.isTrue(s.validate(1234));
			});

			it('validates 12345', () => {
				assert.isTrue(s.validate(12345));
			});

			it('validates "abc"', () => {
				assert.isTrue(s.validate('abc'));
			});

			it('validates "안녕?"', () => {
				assert.isTrue(s.validate('안녕?'));
			});

			it('validates "가1a!"', () => {
				assert.isTrue(s.validate('가1a!'));
			});

			it('validates "가1a! "', () => {
				assert.isTrue(s.validate('가1a! '));
			});

			it('validates "가1a !"', () => {
				assert.isTrue(s.validate('가1a !'));
			});

			it('transforms "" into ""', () => {
				assert.strictEqual(s.transform(''), '');
			});

			it('transforms "   " into ""', () => {
				assert.strictEqual(s.transform('   '), '');
			});

			it('transforms "    " into ""', () => {
				assert.strictEqual(s.transform('    '), '');
			});

			it('transforms "     " into ""', () => {
				assert.strictEqual(s.transform('     '), '');
			});

			it('transforms 0 into "0"', () => {
				assert.strictEqual(s.transform(0), '0');
			});

			it('transforms 123 into "123"', () => {
				assert.strictEqual(s.transform(123), '123');
			});

			it('transforms 1234 into "1234"', () => {
				assert.strictEqual(s.transform(1234), '1234');
			});

			it('transforms 12345 into "1234"', () => {
				assert.strictEqual(s.transform(12345), '1234');
			});

			it('transforms "abc" into "abc"', () => {
				assert.strictEqual(s.transform('abc'), 'abc');
			});

			it('transforms "안녕?" into "안녕?"', () => {
				assert.strictEqual(s.transform('안녕?'), '안녕?');
			});

			it('transforms "가1a!" into "가1a!"', () => {
				assert.strictEqual(s.transform('가1a!'), '가1a!');
			});

			it('transforms "가1a! " into "가1a!"', () => {
				assert.strictEqual(s.transform('가1a! '), '가1a!');
			});

			it('transforms "가1a !" into "가1a"', () => {
				assert.strictEqual(s.transform('가1a !'), '가1a');
			});
		});
	});
});
