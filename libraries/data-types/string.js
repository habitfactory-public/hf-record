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
		this.addValidator(value => Number.isInteger(value) || typeof value === 'string' || value === null);
	}

	getLengthValidator() {
		return value => {
			if(Number.isInteger(value)) {
				value += '';
			}

			return rtrim(value).length <= this.options.length;
		};
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

exports.CHAR = class extends String {
	constructor({ strictMode = true, length = 255} = {}) {
		super({ strictMode, length });
		this.addValidator(this.getLengthValidator());
		this.addTransformer(this.getStringTransformer());
	}
};

exports.VARCHAR = class extends String {
	constructor({ strictMode = true, length = 21844} = {}) {
		super({ strictMode, length });
		this.addValidator(this.getLengthValidator());
		this.addTransformer(this.getStringTransformer());
	}
};

exports.ENUM = class extends String {
	constructor({ strictMode = true, values = []} = {}) {
		// 문자열로 들어오는 경우는 ,로 나눠서 배열로 만든다.
		// index는 ''로부터 시작.
		//
		// enumerable값의 index는 1부터 시작한다. (예외값의 공백문자를 제외하고)
		//
		// strictMode가 true인 경우엔
		// enumerable값 가운데 공백문자가 없다면 공백문자를 컬럼에 대한 값으로 사용할 수 없지만,
		// strictMode가 false라면
		// enumerable값을 벗어난 값에 대해선 자동으로 공백문자를 값으로 대신하며 이때 index는 0이다.
		if(typeof values === 'string') {
			values = values
				.split(',')
				.map(value => value.trim());
		}
		values = values.map((value, i) => [i + 1, value]);
		if(!strictMode && values.filter(value => value[1] === '').length == 0) {
			values.unshift([0, '']);
		}

		super({ strictMode, values });
		this.addValidator(value => {
			if(value === null
				|| (Number.isInteger(value) && this.hasIndex(value))
				|| (typeof value === 'string' && this.hasElement(value))) {
				return true;
			} else {
				return false;
			}
		});

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
						return this.getElement(value);
					} else {
						return value;
					}
				}
			]);
		} else {
			this.addTransformer([
				value => {
					if(value === null) {
						return null;
					} else if(Number.isInteger(value) && this.hasIndex(value)) {
						return this.getElement(value);
					} else if(typeof value === 'string' && this.hasElement(value)) {
						return value;
					} else {
						return '';
					}
				}
			]);
		}
	}

	hasIndex(index) {
		return this.options.values.filter(value => value[0] === index).length > 0;
	}

	hasElement(element) {
		return this.options.values.filter(value => value[1] === element).length > 0;
	}

	getElement(index) {
		for(let value of this.options.values) {
			if(value[0] === index) {
				return value[1];
			}
		}

		return false;
	}
};
