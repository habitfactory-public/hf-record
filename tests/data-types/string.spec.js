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

	describe('ENUM', () => {
		describe('Values', () => {
			it('checks default values #1', () => {
				assert.deepEqual(DataTypeFactory.createString('ENUM', {	values: ['a', 'b', 'c', 'd'] }).options.values, [[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]);
			});

			it('checks default values #2', () => {
				assert.deepEqual(DataTypeFactory.createString('ENUM', {	values: 'a, b, c, d' }).options.values, [[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]);
			});
		});

		describe('StrictMode true', () => {
			const s = DataTypeFactory.createString('ENUM', {
					values: ['a', 'b', 'c', 'd']
				});

			it('checks default values', () => {
				assert.deepEqual(s.options, {
					strictMode: true,
					values: [[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]
				});
			});

			it('validates null', () => {
				assert.isTrue(s.validate(null));
			});

			it('validates ""', () => {
				assert.isFalse(s.validate(''));
			});

			it('validates 0', () => {
				assert.isFalse(s.validate(0));
			});

			it('validates "a"', () => {
				assert.isTrue(s.validate('a'));
			});

			it('validates 1', () => {
				assert.isTrue(s.validate(1));
			});

			it('validates "e"', () => {
				assert.isFalse(s.validate('e'));
			});

			it('validates 5', () => {
				assert.isFalse(s.validate(5));
			});

			it('transforms null into null', () => {
				assert.strictEqual(s.transform(null), null);
			});

			it('transforms "" throws TypeError', () => {
				assert.throws(() => s.transform(''), TypeError);
			});

			it('transforms 0 throws TypeError', () => {
				assert.throws(() => s.transform(0), TypeError);
			});

			it('transforms "a" into "a"', () => {
				assert.strictEqual(s.transform('a'), 'a');
			});

			it('transforms 1 into "a"', () => {
				assert.strictEqual(s.transform(1), 'a');
			});

			it('transforms "e" throws TypeError', () => {
				assert.throws(() => s.transform('e'), TypeError);
			});

			it('transforms 5 throws TypeError', () => {
				assert.throws(() => s.transform(5), TypeError);
			});
		});

		describe('StrictMode false', () => {
			const s = DataTypeFactory.createString('ENUM', {
					strictMode: false,
					values: ['a', 'b', 'c', 'd']
				});

			it('checks default values', () => {
				assert.deepEqual(s.options, {
					strictMode: false,
					values: [[0, ''], [1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]
				});
			});

			it('validates null', () => {
				assert.isTrue(s.validate(null));
			});

			it('validates ""', () => {
				assert.isTrue(s.validate(''));
			});

			it('validates 0', () => {
				assert.isTrue(s.validate(0));
			});

			it('validates "a"', () => {
				assert.isTrue(s.validate('a'));
			});

			it('validates 1', () => {
				assert.isTrue(s.validate(1));
			});

			it('validates "e"', () => {
				assert.isTrue(s.validate('e'));
			});

			it('validates 5', () => {
				assert.isTrue(s.validate(5));
			});

			it('transforms null into null', () => {
				assert.strictEqual(s.transform(null), null);
			});

			it('transforms "" into ""', () => {
				assert.strictEqual(s.transform(''), '');
			});

			it('transforms 0 into ""', () => {
				assert.strictEqual(s.transform(0), '');
			});

			it('transforms "a" into "a"', () => {
				assert.strictEqual(s.transform('a'), 'a');
			});

			it('transforms 1 into "a"', () => {
				assert.strictEqual(s.transform(1), 'a');
			});

			it('transforms "e" into ""', () => {
				assert.strictEqual(s.transform('e'), '');
			});

			it('transforms 5 into ""', () => {
				assert.strictEqual(s.transform(5), '');
			});
		});
	});
});
