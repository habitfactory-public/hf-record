exports = module.exports = {};

const rtrim = string => {
		return string !== null ? string.trimRight() : null;
	};

/**
 * strictMode가 true
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
 * strictMode가 false
 * validate는 모든 validator를 통과한 것으로 간주하고 true를 반환한다.
 * transform은 validate를 통과하지 못한 (strictMode true인 상황의 validate) 값에 대해선
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
	constructor(options = {}) {
		super(options);
		this.addValidator(value => value === null);
	}

	getStrictStringTransformer() {
		return [
			value => {
				if(!this.validate(value)) {
					throw new TypeError(value);
				}

				return value;
			},
			value => {
				if(Number.isInteger(value)) {
					value += '';
				}

				return value;
			},
			value => rtrim(value)
		];
	}

	getNonStrictStringTransformer() {
		return [
			value => {
				if(Number.isInteger(value)) {
					value += '';
				}

				return value;
			},
			value => {
				if(value.length > this.options.length) {
					value = value.substr(0, this.options.length);
				}

				return value;
			},
			value => rtrim(value)
		];
	}

	getStringTransformer() {
		return this.options.strictMode ? this.getStrictStringTransformer() : this.getNonStrictStringTransformer();
	}
}

exports.Char = class extends String {
	constructor({ strictMode = true, length = 255} = {}) {
		super({ strictMode, length });
		this.addValidator([
			value => typeof value === 'string' && rtrim(value).length <= this.options.length,
			value => Number.isInteger(value) && (value + '').length <= this.options.length,
		]);
		this.addTransformer(this.getStringTransformer());
	}
};

exports.Varchar = class extends String {
	constructor({ strictMode = true, length = 21844} = {}) {
		super({ strictMode, length });
		this.addValidator([
			value => typeof value === 'string' && rtrim(value).length <= this.options.length,
			value => Number.isInteger(value) && (value + '').length <= this.options.length,
		]);
		this.addTransformer(this.getStringTransformer());
	}
};

class Enumerable {
	constructor({ strictMode, values }) {
		// 문자열로 들어오는 경우는 ,로 나눠서 배열로 만든다.
		// index는 ''로부터 시작.
		//
		// enumerable값의 index는 1부터 시작한다. (예외값의 공백문자를 제외하고)
		//
		// strictMode가 true인 경우엔
		// enumerable값 가운데 공백문자가 없다면 공백문자를 컬럼에 대한 값으로 사용할 수 없지만,
		// strictMode가 false라면
		// enumerable값을 벗어난 값에 대해선 자동으로 공백문자를 값으로 대신하며 이때 index는 0이다.
		this.keys = new Map();
		this.values = new Map();

		if(typeof values === 'string') {
			values = values
				.split(',')
				.map(value => value.trim());
		}

		values.forEach((value, i) => {
			this.keys.set(i + 1, value);
			this.values.set(value, i + 1);
		});

		if(!strictMode && !this.keys.has('')) {
			this.keys.set(0, '');
			this.values.set('', 0);
		}
	}
}

exports.Enum = class extends String {
	constructor({ strictMode = true, values = []} = {}) {
		super({
			strictMode: strictMode,
			values: new Enumerable({ strictMode, values })
		});
		this.addValidator([
			value => Number.isInteger(value) && value > 0 && this.options.values.keys.has(value),
			value => typeof value === 'string' && this.options.values.values.has(value)
		]);

		if(strictMode) {
			this.addTransformer([
				value => {
					if(!this.validate(value)) {
						throw new TypeError(value);
					}

					return value;
				},
				value => {
					if(Number.isInteger(value)) {
						return this.options.values.keys.get(value);
					} else {
						return value;
					}
				}
			]);
		} else {
			this.addTransformer([
				value => {
					const values = this.options.values;

					if(value === null) {
						return null;
					}

					if(Number.isInteger(value) && values.keys.has(value)) {
						return values.keys.get(value);
					}

					if(typeof value === 'string' && values.values.has(value)) {
						return value;
					}

					return '';
				}
			]);
		}
	}
};

class Settable {
	constructor({ strictMode, values }) {
		// 문자열로 들어오는 경우는 ,로 나눠서 배열로 만든다.
		//
		// set의 10진수 정수형 값은 2의 N(N은 0으로부터 시작하는 인덱스)승으로 정해진다.
		//
		// 2진수인 경우는 따라서 값마다 자리수가 변경됨.
		this.keys = new Map();
		this.values = new Map();

		if(typeof values === 'string') {
			values = values
				.split(',')
				.map(value => value.trim());
		}

		values.forEach((value, i) => {
			this.keys.set(Math.pow(2, i), value);
			this.values.set(value, Math.pow(2, i));
		});
	}

	getMaxDecimalValue() {
		return Math.pow(2, this.keys.size - 1);
	}

	isUnderMaxDecimalValue(value) {
		return this.getMaxDecimalValue() >= value;
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

exports.Set = class extends String {
	constructor({ strictMode = true, values = []} = {}) {
		super({
			strictMode: strictMode,
			values: new Settable({ strictMode, values })
		});
		this.addValidator([
			value => Number.isInteger(value) && value > 0 && this.options.values.isUnderMaxDecimalValue(value),
			value => (typeof value === 'string' || Array.isArray(value)) && this.options.values.includes(value)
		]);

		if(strictMode) {
			this.addTransformer([
				value => {
					if(!this.validate(value)) {
						throw new TypeError(value);
					}

					return value;
				},
				value => {
					const values = this.options.values;

					if(value === null) {
						return null;
					}

					if(Number.isInteger(value) && value > 0 && values.isUnderMaxDecimalValue(value)) {
						return values.decimalValueToItems(value);
					}

					if((typeof value === 'string' || Array.isArray(value)) && values.includes(value)) {
						return value;
					}

					throw new TypeError(value);
				}
			]);
		} else {
			this.addTransformer([
				value => {
					const values = this.options.values;

					if(value === null) {
						return null;
					}

					if(Number.isInteger(value) && value > 0 && values.isUnderMaxDecimalValue(value)) {
						return values.decimalValueToItems(value);
					}

					if((typeof value === 'string' || Array.isArray(value)) && values.includes(value)) {
						return value;
					}

					return '';
				}
			]);
		}
	}
};

exports.TinyText = class extends String {
	constructor({ strictMode = true} = {}) {
		super({
			strictMode: strictMode,
		 	length: 255
		});
		this.addValidator([
			value => Number.isInteger(value) && value > 0 && this.options.values.keys.has(value),
			value => typeof value === 'string' && values.values.has(value)
		]);
		this.addTransformer(this.getStringTransformer());
	}
};

exports.Text = class extends String {
	constructor({ strictMode = true} = {}) {
		super({
			strictMode: strictMode,
		 	length: 65535
		});
		this.addValidator([
			value => Number.isInteger(value) && value > 0 && this.options.values.keys.has(value),
			value => typeof value === 'string' && values.values.has(value)
		]);
		this.addTransformer(this.getStringTransformer());
	}
};

exports.MediumText = class extends String {
	constructor({ strictMode = true} = {}) {
		super({
			strictMode: strictMode,
		 	length: 16777215
		});
		this.addValidator([
			value => Number.isInteger(value) && value > 0 && this.options.values.keys.has(value),
			value => typeof value === 'string' && values.values.has(value)
		]);
		this.addTransformer(this.getStringTransformer());
	}
};

exports.LongText = class extends String {
	constructor({ strictMode = true} = {}) {
		super({
			strictMode: strictMode,
		 	length: 4294967295
		});
		this.addValidator([
			value => Number.isInteger(value) && value > 0 && this.options.values.keys.has(value),
			value => typeof value === 'string' && values.values.has(value)
		]);
		this.addTransformer(this.getStringTransformer());
	}
};
