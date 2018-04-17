exports = module.exports = {};

class DataTypeValue {
	constructor(value) {
		this._value = value;
		this._resolved = false;
	}

	/**
	 * 원시값의 길이를 반환.
	 * 
	 * - string -> 문자열의 길이
	 * - array -> 배열의 길이 (요소 갯수의 총합)
	 * - integer -> 정수를 문자열로 바꾼 것의 길이
	 * 
	 * @return integer
	 */
	get length() {
		if(this.isInteger()) {
			return (this._value + '').length;
		} else if(this.isString()) {
			return this._value.trimRight().length;
		} else if(this.isArray()) {
			return this._value.length;
		} else {
			return 0;
		}
	}

	invoke(runnable) {
		return runnable(this._value);
	}

	isNumeric() {
		return this.isString() && /^[0-9]+$/.test(this._value);
	}

	isInteger() {
		return Number.isInteger(this._value);
	}

	isString() {
		return typeof this._value === 'string';
	}

	isArray() {
		return Array.isArray(this._value);
	}

	isNull() {
		return this._value === null;
	}

	isEmpty() {
		return this._value === '';
	}

	isGreater(number) {
		return this.isInteger() && this._value > number;
	}

	isGreaterOrEqual(number) {
		return this.isGreater(number) || this.isEqual(number);
	}

	isLesser(number) {
		return this.isInteger() && this._value < number;
	}

	isLesserOrEqual(number) {
		return this.isLesser(number) || this.isEqual(number);
	}

	isEqual(equal) {
		return this._value === equal;
	}

	isBetween({ MIN, MAX }) {
		return this.isGreaterOrEqual(MIN) && this.isLesserOrEqual(MAX);
	}

	instanceOf(object) {
		return this._value instanceof object;
	}

	resolve() {
		this._resolved = true;
		return this;
	}

	isResolved() {
		return this._resolved;
	}

	setBetween({ MIN, MAX }) {
		return this.set(Math.min(Math.max(this.get(), MIN), MAX));
	}

	set(value) {
		if(value !== undefined) {
			this._value = value;
		}
		return this;
	}

	get() {
		return this.isString() && this._value !== null ? this._value.trimRight() : this._value;
	}
}

exports.DataType = class DataType {
	constructor(attributes = {}) {
		this._attributes = Object.assign({}, {
			isStrictMode: true,
			isNotNull: false,
			isBinary: false,
			isUnsigned: false,
			isZeroFill: false
		}, attributes);
		this._validators = [];
		this._transformers = [];
	}

	isStrictMode() {
		return this._attributes.isStrictMode;
	}

	isNotNull() {
		return this._attributes.isNotNull;
	}

	isBinary() {
		return this._attributes.isBinary;
	}

	isUnsigned() {
		return this._attributes.isUnsigned;
	}

	isZeroFill() {
		return this._attributes.isZeroFill;
	}

	prependValidator(validator) {
		if(Array.isArray(validator)) {
			this._validators = validator.concat(this._validators);
		} else {
			this._validators.unshift(validator);
		}

		return this;
	}

	appendValidator(validator) {
		if(Array.isArray(validator)) {
			this._validators = this._validators.concat(validator);
		} else {
			this._validators.push(validator);
		}

		return this;
	}

	getValidators() {
		return this._validators;
	}

	prependTransformer(transformer) {
		if(Array.isArray(transformer)) {
			this._transformers = transformer.concat(this._transformers);
		} else {
			this._transformers.unshift(transformer);
		}

		return this;
	}

	appendTransformer(transformer) {
		if(Array.isArray(transformer)) {
			this._transformers = this._transformers.concat(transformer);
		} else {
			this._transformers.push(transformer);
		}

		return this;
	}

	getTransformers() {
		return this._transformers;
	}

	validate(value, force = false) {
		if((!this.isStrictMode() || this.getValidators().length === 0) && !force) {
			return true;
		}

		if(!(value instanceof DataTypeValue)) {
			value = new DataTypeValue(value);
		}

		return this
			.getValidators()
			.some(validator => {
				return validator(value);
			});
	}

	transform(value) {
		if(this.getTransformers().length === 0) {
			return value;
		}

		return this
			.getTransformers()
			.reduce((accumulator, transformer) => {
				if(accumulator.isResolved()) {
					return accumulator;
				} else {
					return transformer(accumulator);
				}
			}, new DataTypeValue(value))
			.get();
	}
};

exports.DataTypeFactory = class DataTypeFactory {
	static loadClass(className, file) {
		if(!this.loadedClass) {
			this.loadedClass = {};
		}

		if(!this.loadedClass[className]) {
			this.loadedClass[className] = require(file)[className];
		}

		return this.loadedClass[className];
	}

	static createDate(attributes = {}) {
		return new(this.loadClass('Date', './date-and-time'))(attributes);
	}

	static createTime(attributes = {}) {
		return new(this.loadClass('Time', './date-and-time'))(attributes);
	}

	static createDatetime(attributes = {}) {
		return new(this.loadClass('Datetime', './date-and-time'))(attributes);
	}

	static createTimestamp(attributes = {}) {
		return new(this.loadClass('Timestamp', './date-and-time'))(attributes);
	}

	static createYear(attributes = {}) {
		return new(this.loadClass('Year', './date-and-time'))(attributes);
	}

	static createTinyInt(attributes = {}) {
		return new(this.loadClass('TinyInt', './numeric'))(attributes);
	}

	static createSmallInt(attributes = {}) {
		return new(this.loadClass('SmallInt', './numeric'))(attributes);
	}

	static createMediumInt(attributes = {}) {
		return new(this.loadClass('MediumInt', './numeric'))(attributes);
	}

	static createInt(attributes = {}) {
		return new(this.loadClass('Int', './numeric'))(attributes);
	}

	static createBigInt(attributes = {}) {
		return new(this.loadClass('BigInt', './numeric'))(attributes);
	}

	static createChar(attributes = {}) {
		return new(this.loadClass('Char', './string'))(attributes);
	}

	static createVarchar(attributes = {}) {
		return new(this.loadClass('Varchar', './string'))(attributes);
	}

	static createEnum(attributes = {}) {
		return new(this.loadClass('Enum', './string'))(attributes);
	}

	static createSet(attributes = {}) {
		return new(this.loadClass('Set', './string'))(attributes);
	}

	static createTinyText(attributes = {}) {
		return new(this.loadClass('TinyText', './string'))(attributes);
	}

	static createText(attributes = {}) {
		return new(this.loadClass('Text', './string'))(attributes);
	}

	static createMediumText(attributes = {}) {
		return new(this.loadClass('MediumText', './string'))(attributes);
	}

	static createLongText(attributes = {}) {
		return new(this.loadClass('LongText', './string'))(attributes);
	}
};
