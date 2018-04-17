exports = module.exports = {};

/**
 * isStrictMode가 true
 * validate는 모든 validator를 반드시 통과해야한다.
 * transform은 validate를 통과하지 못하는 입력값에 대해선 TypeError를 던진다.
 *
 * validator는
 * 1. Number.isInteger(value) || typeof value === 'string'을 통과.
 * 2. 정의된 length 이내여야 함.
 *
 * transformer는
 * 1. 정수는 문자열로 변환
 * 2. 우측 공백들은 ''으로 변환
 *
 * --->
 *
 * isStrictMode가 false
 * validate는 모든 validator를 통과한 것으로 간주하고 true를 반환한다.
 * transform은 validate를 통과하지 못한 (isStrictMode true인 상황의 validate) 값에 대해선
 * 형변환을 시도하지만, 가능하지 않은 경우엔 입력값을 그대로 반환한다.
 *
 * validator는
 * 1. 모두 true를 반환. (validate 하지 않음)
 *
 * transformer는
 * 1. 정수는 문자열로 변환
 * 2. 우측 공백들은 ''으로 변환
 * 3. length를 넘어서는 것들은 length까지만 자름.
 */
class String extends require('./data-type').DataType {
	constructor(attributes = {}) {
		super(attributes);

		this.appendValidator(value => value.isNull());

		if(this.isStrictMode()) {
			this.appendTransformer(value => {
				if(!this.validate(value)) {
					throw new TypeError(value.get());
				}

				return value;
			});
		}
	}

	getLength() {
		return this._attributes.length;
	}
}

exports.Char = class Char extends String {
	constructor({ isStrictMode = true, length = 255} = {}) {
		super({
			isStrictMode: isStrictMode,
			length: Math.max(Math.min(length, 255), 0)
		});

		this.appendValidator([
			value => value.isString() && value.length <= this.getLength(),
			value => value.isInteger() && value.length <= this.getLength()
		]);

		this.appendTransformer([
			value => {
				if(value.isInteger()) {
					value.set(value.get() + '');
				}

				return value;
			},
			value => {
				if(value.length > this.getLength()) {
					value.set(value.get().substr(0, this.getLength()));
				}

				return value;
			},
			value => {
				return value
					.set(value.get())
					.resolve();
			}
		]);
	}
};

exports.Varchar = class Varchar extends String {
	constructor({ isStrictMode = true, length = 21844} = {}) {
		super({
			isStrictMode: isStrictMode,
			length: Math.max(Math.min(length, 21844), 0)
		});

		this.appendValidator([
			value => value.isString() && value.length <= this.getLength(),
			value => value.isInteger() && value.length <= this.getLength()
		]);

		this.appendTransformer([
			value => {
				if(value.isInteger()) {
					value.set(value.get() + '');
				}

				return value;
			},
			value => {
				if(value.length > this.getLength()) {
					value.set(value.get().substr(0, this.getLength()));
				}

				return value;
			},
			value => {
				return value
					.set(value.get())
					.resolve();
			}
		]);
	}
};

class Enumerable {
	constructor({ isStrictMode, length }) {
		// 문자열로 들어오는 경우는 ,로 나눠서 배열로 만든다.
		// index는 ''로부터 시작.
		//
		// enumerable값의 index는 1부터 시작한다. (예외값의 공백문자를 제외하고)
		//
		// isStrictMode가 true인 경우엔
		// enumerable값 가운데 공백문자가 없다면 공백문자를 컬럼에 대한 값으로 사용할 수 없지만,
		// isStrictMode가 false라면
		// enumerable값을 벗어난 값에 대해선 자동으로 공백문자를 값으로 대신하며 이때 index는 0이다.
		this.keys = new Map();
		this.values = new Map();

		if(typeof length === 'string') {
			length = length
				.split(',')
				.map(value => value.trim());
		}

		length.forEach((value, i) => {
			this.keys.set(i + 1, value);
			this.values.set(value, i + 1);
		});

		if(!isStrictMode && !this.keys.has('')) {
			this.keys.set(0, '');
			this.values.set('', 0);
		}
	}

	getBoundKeysHas() {
		return this.keys.has.bind(this.keys);
	}

	getBoundValuesHas() {
		return this.values.has.bind(this.values);
	}
}

exports.Enum = class Enum extends String {
	constructor({ isStrictMode = true, length = []} = {}) {
		super({
			isStrictMode: isStrictMode,
			length: new Enumerable({ isStrictMode, length })
		});
		this.appendValidator([
			value => value.isGreater(0) && value.invoke(this.getLength().getBoundKeysHas()),
			value => value.isString() && value.invoke(this.getLength().getBoundValuesHas())
		]);
		this.appendTransformer([
			value => {
				if(value.isNull()) {
					return value.resolve();
				}

				return value;
			},
			value => {
				if(value.isGreater(0) && value.invoke(this.getLength().getBoundKeysHas())) {
					return value
						.set(this.getLength().keys.get(value.get()))
						.resolve();
				}

				return value;
			},
			value => {
				if(value.isString() && value.invoke(this.getLength().getBoundValuesHas())) {
					return value.resolve();
				}

				return value
					.set('')
					.resolve();
			}
		]);
	}
};

class Settable {
	constructor({ isStrictMode, length }) {
		// 문자열로 들어오는 경우는 ,로 나눠서 배열로 만든다.
		//
		// set의 10진수 정수형 값은 2의 N(N은 0으로부터 시작하는 인덱스)승으로 정해진다.
		//
		// 2진수인 경우는 따라서 값마다 자리수가 변경됨.
		this.keys = new Map();
		this.values = new Map();

		if(typeof length === 'string') {
			length = length
				.split(',')
				.map(value => value.trim());
		}

		length.forEach((value, i) => {
			this.keys.set(Math.pow(2, i), value);
			this.values.set(value, Math.pow(2, i));
		});

		this.maxDecimalValue = Math.pow(2, this.keys.size - 1);
	}

	isLesserOrEqualMaxDecimalValue(value) {
		return this.maxDecimalValue >= value;
	}

	includes(value) {
		if(typeof value === 'string') {
			if(value.indexOf(',') >= 0) {
				value = value.split(',').map(value => value.trim());
			} else {
				value = [value];
			}
		}

		if(value.length > this.values.keys.size) {
			return false;
		}

		if(value.filter(value => this.values.has(value)).length === value.length) {
			return true;
		} else {
			return false;
		}
	}

	decimalValueToItems(value) {
		return (value >>> 0)
			.toString(2)
			.split('')
			.reverse()
			.map((bin, i) => bin == '1' ? this.keys.get(Math.pow(2, i)) : undefined)
			.filter(value => !!value)
			.join(', ');
	}
}

exports.Set = class Set extends String {
	constructor({ isStrictMode = true, length = []} = {}) {
		super({
			isStrictMode: isStrictMode,
			length: new Settable({ isStrictMode, length })
		});

		this.appendValidator([
			value => value.isGreater(0) && value.invoke(this.getLength().isLesserOrEqualMaxDecimalValue.bind(this.getLength())),
			value => (value.isString() || value.isArray()) && value.invoke(this.getLength().includes.bind(this.getLength()))
		]);

		this.appendTransformer([
			value => {
				if(value.isNull()) {
					return value.resolve();
				}

				return value;
			},
			value => {
				if(value.isGreater(0) && value.invoke(this.getLength().isLesserOrEqualMaxDecimalValue.bind(this.getLength()))) {
					return value
						.set(this.getLength().decimalValueToItems(value.get()))
						.resolve();
				}

				return value;
			},
			value => {
				if((value.isString() || value.isArray()) && value.invoke(this.getLength().includes.bind(this.getLength()))) {
					return value.resolve();
				}

				if(this.isStrictMode()) {
					throw new TypeError(value.get());
				}

				return value
					.set('')
					.resolve();
			}
		]);
	}
};

exports.TinyText = class TinyText extends String {
	constructor({ isStrictMode = true } = {}) {
		super({
			isStrictMode: isStrictMode,
		 	length: 255
		});

		this.appendValidator(value => (value.isString() || value.isInteger()) && value.length <= this.getLength());

		this.appendTransformer([
			value => {
				if(value.isInteger()) {
					value.set(value.get() + '');
				}

				return value;
			},
			value => value.resolve()
		]);
	}
};

exports.Text = class Text extends String {
	constructor({ isStrictMode = true } = {}) {
		super({
			isStrictMode: isStrictMode,
		 	length: 65535
		});

		this.appendValidator(value => (value.isString() || value.isInteger()) && value.length <= this.getLength());

				this.appendTransformer([
			value => {
				if(value.isInteger()) {
					value.set(value.get() + '');
				}

				return value;
			},
			value => value.resolve()
		]);
	}
};

exports.MediumText = class MediumText extends String {
	constructor({ isStrictMode = true } = {}) {
		super({
			isStrictMode: isStrictMode,
		 	length: 16777215
		});

		this.appendValidator(value => (value.isString() || value.isInteger()) && value.length <= this.getLength());

				this.appendTransformer([
			value => {
				if(value.isInteger()) {
					value.set(value.get() + '');
				}

				return value;
			},
			value => value.resolve()
		]);
	}
};

exports.LongText = class LongText extends String {
	constructor({ isStrictMode = true } = {}) {
		super({
			isStrictMode: isStrictMode,
		 	length: 4294967295
		});
		this.appendValidator(value => (value.isString() || value.isInteger()) && value.length <= this.getLength());
		this.appendTransformer(value => value.resolve());
	}
};
