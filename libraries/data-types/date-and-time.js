exports = module.exports = {};

const
	moment = require('moment'),
	patterns = {
		Date: value => /^[19]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value),
		Time: value => /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(value),
		Datetime: value => /^[19]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(value),
		Timestamp: value => /^[19]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(value),
		Year: value => /^(19(0[1-9]|[1-9][0-9])|2(0[0-9]{2}|1([0-4][0-9]|5[0-5])))$/.test(value),
	};

/**
 * isStrictMode가 true
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
 * isStrictMode가 false
 * validate는 모든 validator를 통과한 것으로 간주하고 true를 반환한다.
 * transform은 validate를 통과하지 못한 (isStrictMode true인 상황의 validate) 값에 대해선
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
	constructor(attributes = {}) {
		super(attributes);
		
		this.appendValidator([
			value => value.instanceOf(Date),
			value => value.isGreaterOrEqual(0)
		]);

		if(this.isStrictMode()) {
			this.appendTransformer(value => {
				if(!this.validate(value)) {
					throw new TypeError(value.get());
				}

				return value;
			});
		}

		this.appendTransformer(value => {
			if(value.isInteger() && value.length <= 10) {
				return value
					.set(moment(value.get() * 1000).format(this.getDateFormat()))
					.resolve();
			}

			return value;
		});

		if(!this.isStrictMode()) {
			this.appendTransformer(value => {
				if(!this.validate(value, true)) {
					return value
						.set('0')
						.resolve();
				}

				return value;
			});
		}

		this.appendTransformer(value => {
			return value
				.set(moment(value.get()).format(this.getDateFormat()))
				.resolve();
		});
	}

	getDateFormat() {
		return this._attributes.dateFormat;
	}
};

// 자바스크립트 Date 클래스와 구분하기 위해
exports.Date = class Date_ extends DateAndTime {
	constructor({ isStrictMode = true } = {}) {
		super({
			isStrictMode: isStrictMode,
		 	dateFormat: 'YYYY-MM-DD'
		});

		this.appendValidator(value => value.isString() && value.invoke(patterns.Date));
	}
};

exports.Time = class Time extends DateAndTime {
	constructor({ isStrictMode = true } = {}) {
		super({
			isStrictMode: isStrictMode,
		 	dateFormat: 'HH:mm:ss'
		});

		this.appendValidator(value => value.isString() && value.invoke(patterns.Time));

		this.prependTransformer(value => {
			// 시간 패턴과 일치한다면 년월일을 임의로 붙여
			// Date 객체로 만든다.
			if(value.isString() && value.invoke(patterns.Time)) {
				value.set(new Date(`1970-01-01 ${value.get()}`));
			}

			return value;
		});
	}
};

exports.Datetime = class Datetime extends DateAndTime {
	constructor({ isStrictMode = true } = {}) {
		super({
			isStrictMode: isStrictMode,
		 	dateFormat: 'YYYY-MM-DD HH:mm:ss'
		});

		this.appendValidator(value => value.isString() && value.invoke(patterns.Datetime));
	}
};

exports.Timestamp = class Timestamp extends DateAndTime {
	constructor({ isStrictMode = true } = {}) {
		super({
			isStrictMode: isStrictMode,
		 	dateFormat: 'YYYY-MM-DD HH:mm:ss'
		});

		this.appendValidator(value => value.isString() && value.invoke(patterns.Timestamp));
	}
};

exports.Year = class Year extends DateAndTime {
	constructor({ isStrictMode = true } = {}) {
		super({
			isStrictMode: isStrictMode,
		 	dateFormat: 'YYYY'
		});

		this.appendValidator(value => value.isString() && value.invoke(patterns.Year));
		
		this.prependTransformer(value => {
			// 년 패턴과 일치한다면 월일을 임의로 붙여
			// Date 객체로 만든다.
			if(value.isString() && value.invoke(patterns.Year)) {
				value.set(new Date(`${value.get()}-01-01`));
			}

			return value;
		});
	}
};
