exports = module.exports = {};

const
	_ = require('underscore'),
	moment = require('moment'),
	patterns = {
		Date: value => /^[19]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value),
		Time: value => /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(value),
		Datetime: value => /^[19]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(value),
		Timestamp: value => /^[19]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(value),
		Year: value => /^(19(0[1-9]|[1-9][0-9])|2(0[0-9]{2}|1([0-4][0-9]|5[0-5])))$/.test(value),
	};

/**
 * strictMode가 true
 * validate는 모든 validator를 반드시 통과해야한다.
 * transform은 validate를 통과하지 못하는 입력값에 대해선 TypeError를 던진다.
 *
 * validator는
 * 1. 자바스크립트 네이티브 Date 객체이거나
 * 2. 정수(양수)거나 (unix timestamp 혹은 unix ms timestamp로 간주)
 * 3. 각 타입별 기본 날짜 포맷과 일치하는 경우에만 통과.
 *
 * transformer는
 * 1. validator를 통과하지 못하는 경우는 TypeError를 발생.
 * 2. Date 객체거나 정수인 경우는 각 타입별 기본 날짜 포맷으로 변환.
 * 3. 각 타입별 기본 날짜 포맷인 경우는 그대로 반환.
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
 * 1. Date 객체거나 정수인 경우는 각 타입별 기본 날짜 포맷으로 변환.
 * 2. 각 타입별 기본 날짜 포맷인 경우는 그대로 반환.
 * 3. 그 외의 경우는 "0"으로 변환.
 */
class DateAndTime extends require('./data-type').DataType {
	constructor(options = {}) {
		super(options);
		this.addValidator([
			value => value instanceof Date,
			value => Number.isInteger(value) && value >= 0
		]);
	}

	getStrictDateAndTimeTransformer(format) {
		return [
			value => {
				if(!this.validate(value)) {
					throw new TypeError(value);
				}

				return value;
			},
			value => {
				if(Number.isInteger(value) && (value + '').length <= 10) {
					value *= 1000;
				}

				return moment(value).format(format);
			}
		];
	}

	getNonStrictDateAndTimeTransformer(format) {
		return [
			value => {
				if(Number.isInteger(value) && (value + '').length <= 10) {
					value *= 1000;
				}

				return value;
			},
			value => {
				if(this.validate(value, true)) {
					return moment(value).format(format);
				} else {
					return '0';
				}
			}
		];
	}

	getDateAndTimeTransformer(format) {
		return this.options.strictMode ? this.getStrictDateAndTimeTransformer(format) : this.getNonStrictDateAndTimeTransformer(format);
	}
};

exports.Date = class extends DateAndTime {
	constructor({ strictMode = true} = {}) {
		super({ strictMode });
		this.addValidator(value => patterns.Date(value));
		this.addTransformer(this.getDateAndTimeTransformer('YYYY-MM-DD'));
	}
};

exports.Time = class extends DateAndTime {
	constructor({ strictMode = true} = {}) {
		super({ strictMode });
		this.addValidator(value => patterns.Time(value));
		this.addTransformer(value => {
			// 시간 패턴과 일치한다면 년월일을 임의로 붙여
			// Date 객체로 만든다.
			if(typeof value === 'string' && patterns.Time(value)) {
				value = new Date(`1970-01-01 ${value}`);
			}

			return value;
		});
		this.addTransformer(this.getDateAndTimeTransformer('HH:mm:ss'));
	}
};

exports.Datetime = class extends DateAndTime {
	constructor({ strictMode = true} = {}) {
		super({ strictMode });
		this.addValidator(value => patterns.Datetime(value));
		this.addTransformer(this.getDateAndTimeTransformer('YYYY-MM-DD HH:mm:ss'));
	}
};

exports.Timestamp = class extends DateAndTime {
	constructor({ strictMode = true} = {}) {
		super({ strictMode });
		this.addValidator(value => patterns.Timestamp(value));
		this.addTransformer(this.getDateAndTimeTransformer('YYYY-MM-DD HH:mm:ss'));
	}
};

exports.Year = class extends DateAndTime {
	constructor({ strictMode = true} = {}) {
		super({ strictMode });
		this.addValidator(value => patterns.Year(value));
		this.addTransformer(value => {
			// 년 패턴과 일치한다면 월일을 임의로 붙여
			// Date 객체로 만든다.
			if(typeof value === 'string' && patterns.Year(value)) {
				value = new Date(`${value}-01-01`);
			}

			return value;
		});
		this.addTransformer(this.getDateAndTimeTransformer('YYYY'));
	}
};
