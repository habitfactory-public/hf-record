exports = module.exports = {};

/**
 * strictMode가 true
 * validate는 모든 validator를 반드시 통과해야한다.
 * transform은 validate를 통과하지 못하는 입력값에 대해선 TypeError를 던진다.
 *
 * validator는
 * 1. Number.isInteger(value)를 통과.
 * 2. 타입별 정수 범위를 초과하지 않는 것.
 *
 * transformer는
 * 1. validator를 통과하지 못하는 경우는 TypeError를 발생.
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
 * 1. 숫자로만 이루어진 문자열의 경우 정수로 변환.
 * 2. 타입별 정수범위를 넘어가는 정수들은 정수범위 max, min으로 수정.
 * 3. 그 외에는 0으로 변환.
 */
class Numeric extends require('./data-type').DataType {
	constructor(options = {}) {
		super(options);
		this.addValidator((() => {
			const { MIN, MAX } = this.getRanges();
			return value => Number.isInteger(value) && value >= MIN && value <= MAX;
		})());
		this.addTransformer(this.getCommonTransformers());
	}

	getRanges() {
		if(this.options.isUnsigned) {
			return {
				MIN: this.options.ranges.UNSIGNED_MIN,
				MAX: this.options.ranges.UNSIGNED_MAX
			};
		} else {
			return {
				MIN: this.options.ranges.MIN,
				MAX: this.options.ranges.MAX
			};
		}
	}

	getCommonTransformers() {
		const
			transformers = [],
			isNumeric = value => /^[0-9]+$/.test(value),
			{ MIN, MAX } = this.getRanges();

		if(this.options.strictMode) {
			transformers.push(value => {
				if(!this.validate(value.value())) {
					throw new TypeError(value.value());
				}

				return value.resolve();
			});
		}

		transformers.push(value => {
			if(typeof value.value() === 'string' && isNumeric(value.value())) {
				return value.value(value.value() * 1);
			}

			return value;
		});

		transformers.push(value => {
			if(Number.isInteger(value.value())) {
				return value
					.value(Math.min(Math.max(value.value(), MIN), MAX))
					.resolve();
			}

			return value
				.value(0)
				.resolve();
		});

		return transformers;
	}
}

exports.TinyInt = class extends Numeric {
	constructor({ strictMode = true, isUnsigned = false} = {}) {
		super({
			strictMode: strictMode,
			isUnsigned: isUnsigned,
			ranges: {
				MIN: -128,
				MAX: 128,
				UNSIGNED_MIN: 0,
				UNSIGNED_MAX: 255
			}
		});
	}
};

exports.SmallInt = class extends Numeric {
	constructor({ strictMode = true, isUnsigned = false} = {}) {
		super({
			strictMode: strictMode,
			isUnsigned: isUnsigned,
			ranges: {
				MIN: -32768,
				MAX: 32768,
				UNSIGNED_MIN: 0,
				UNSIGNED_MAX: 65535
			}
		});
	}
};

exports.MediumInt = class extends Numeric {
	constructor({ strictMode = true, isUnsigned = false} = {}) {
		super({
			strictMode: strictMode,
			isUnsigned: isUnsigned,
			ranges: {
				MIN: -8388608,
				MAX: 8388608,
				UNSIGNED_MIN: 0,
				UNSIGNED_MAX: 16777215
			}
		});
	}
};

exports.Int = class extends Numeric {
	constructor({ strictMode = true, isUnsigned = false} = {}) {
		super({
			strictMode: strictMode,
			isUnsigned: isUnsigned,
			ranges: {
				MIN: -2147483648,
				MAX: 2147483648,
				UNSIGNED_MIN: 0,
				UNSIGNED_MAX: 4294967295
			}
		});
	}
};

/**
 * javascript의 정수 표현 한계는 (+-)9007199254740992(2^53 - 1)며
 * mysql의 BigInt의 2^63 - 1 보다는 작다. 그러므로 signed나 unsigned 모두
 * javascript의 최대 표현 한계인 2^53 - 1을 따른다.
 */
exports.BigInt = class extends Numeric {
	constructor({ strictMode = true, isUnsigned = false} = {}) {
		super({
			strictMode: strictMode,
			isUnsigned: isUnsigned,
			ranges: {
				MAX: Number.MAX_SAFE_INTEGER,
				MIN: Number.MAX_SAFE_INTEGER * -1,
				UNSIGNED_MIN: 0,
				UNSIGNED_MAX: Number.MAX_SAFE_INTEGER
			}
		});
	}
};
