const
	assert = require('chai').assert,
	{ DataTypeFactory } = require('../libraries/data-types/data-type');

// char length 0 - 255 (765byte)
// varchar length 0 - 21845 (65535byte)
describe('string.js', () => {
	describe('Char', () => {
		describe('StrictMode true, length 4', () => {
			const s = DataTypeFactory.createString('Char', {
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
			const s = DataTypeFactory.createString('Char', {
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

	describe('Varchar', () => {
		describe('StrictMode true, length 4', () => {
			const s = DataTypeFactory.createString('Varchar', {
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
			const s = DataTypeFactory.createString('Varchar', {
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

	describe('Enum', () => {
		describe('Check Default Values', () => {
			const target = {
					keys: new Map([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]),
					values: new Map()
				};

			for(let [key, value] of target.keys.entries()) {
				target.values.set(value, key);
			}

			it('checks default values #1', () => {
				const s = DataTypeFactory.createString('Enum', {
						values: ['a', 'b', 'c', 'd']
					});
				assert.deepEqual(s.options.values.keys, target.keys);
			});

			it('checks default values #2', () => {
				const s = DataTypeFactory.createString('Enum', {
						values: ['a', 'b', 'c', 'd']
					});
				assert.deepEqual(s.options.values.values, target.values);
			});

			it('checks default values #3', () => {
				const s = DataTypeFactory.createString('Enum', {
						values: 'a, b, c, d'
					});
				assert.deepEqual(s.options.values.keys, target.keys);
			});

			it('checks default values #4', () => {
				const s = DataTypeFactory.createString('Enum', {
						values: 'a, b, c, d'
					});
				assert.deepEqual(s.options.values.values, target.values);
			});
		});

		describe('StrictMode true', () => {
			const s = DataTypeFactory.createString('Enum', {
					values: ['a', 'b', 'c', 'd']
				});

			it('checks default values', () => {
				assert.isTrue(s.options.strictMode);
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
			const s = DataTypeFactory.createString('Enum', {
					strictMode: false,
					values: ['a', 'b', 'c', 'd']
				});

			it('checks default values', () => {
				assert.isFalse(s.options.strictMode);
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

	describe('Set', () => {
		describe('Check Default Values', () => {
			const target = {
					keys: new Map([[1, 'a'], [2, 'b'], [4, 'c'], [8, 'd']]),
					values: new Map()
				};

			for(let [key, value] of target.keys.entries()) {
				target.values.set(value, key);
			}

			it('checks default values #1', () => {
				const s = DataTypeFactory.createString('Set', {
						values: ['a', 'b', 'c', 'd']
					});
				assert.deepEqual(s.options.values.keys, target.keys);
			});

			it('checks default values #2', () => {
				const s = DataTypeFactory.createString('Set', {
						values: ['a', 'b', 'c', 'd']
					});
				assert.deepEqual(s.options.values.values, target.values);
			});

			it('checks default values #3', () => {
				const s = DataTypeFactory.createString('Set', {
						values: 'a, b, c, d'
					});
				assert.deepEqual(s.options.values.keys, target.keys);
			});

			it('checks default values #4', () => {
				const s = DataTypeFactory.createString('Set', {
						values: 'a, b, c, d'
					});
				assert.deepEqual(s.options.values.values, target.values);
			});
		});

		describe('StrictMode true', () => {
			const s = DataTypeFactory.createString('Set', {
					values: ['a', 'b', 'c', 'd']
				});

			it('checks default values', () => {
				assert.isTrue(s.options.strictMode);
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

			it('validates 9', () => {
				assert.isFalse(s.validate(9));
			});

			it('validates ["a", "b"]', () => {
				assert.isTrue(s.validate(['a', 'b']));
			});

			it('validates ["a", "e"]', () => {
				assert.isFalse(s.validate(['a', 'e']));
			});

			it('validates ["e", "f"]', () => {
				assert.isFalse(s.validate(['e', 'f']));
			});

			it('validates "a, b"', () => {
				assert.isTrue(s.validate('a, b'));
			});

			it('validates "a, e"', () => {
				assert.isFalse(s.validate('a, e'));
			});

			it('validates "e, f"', () => {
				assert.isFalse(s.validate('e, f'));
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

			it('transforms 3 into "a, b"', () => {
				assert.strictEqual(s.transform(3), 'a, b');
			});

			it('transforms "e" throws TypeError', () => {
				assert.throws(() => s.transform('e'), TypeError);
			});

			it('transforms 9 throws TypeError', () => {
				assert.throws(() => s.transform(9), TypeError);
			});
		});

		describe('StrictMode false', () => {
			const s = DataTypeFactory.createString('Set', {
					strictMode: false,
					values: ['a', 'b', 'c', 'd']
				});

			it('checks default values', () => {
				assert.isFalse(s.options.strictMode);
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

			it('validates 9', () => {
				assert.isTrue(s.validate(9));
			});

			it('validates ["a", "b"]', () => {
				assert.isTrue(s.validate(['a', 'b']));
			});

			it('validates ["a", "e"]', () => {
				assert.isTrue(s.validate(['a', 'e']));
			});

			it('validates ["e", "f"]', () => {
				assert.isTrue(s.validate(['e', 'f']));
			});

			it('validates "a, b"', () => {
				assert.isTrue(s.validate('a, b'));
			});

			it('validates "a, e"', () => {
				assert.isTrue(s.validate('a, e'));
			});

			it('validates "e, f"', () => {
				assert.isTrue(s.validate('e, f'));
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

			it('transforms 3 into "a, b"', () => {
				assert.strictEqual(s.transform(3), 'a, b');
			});

			it('transforms "e" into ""', () => {
				assert.strictEqual(s.transform("e"), '');
			});

			it('transforms 9 into ""', () => {
				assert.strictEqual(s.transform(9), '');
			});
		});
	});
});
