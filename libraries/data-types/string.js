exports = module.exports = {};

const rtrim = string => {
		return string.replace(/[\s\uFEFF\xA0]+$/g, '');
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
		this.addValidator(value => Number.isInteger(value) || typeof value === 'string');
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
