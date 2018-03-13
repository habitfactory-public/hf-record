class DataType {
	constructor(options = {}) {
		options.strictMode = options.strictMode === undefined ? true : options.strictMode;
		this.options = options;
		this.validators = [];
		this.transformers = [];
	}

	addValidator(validator) {
		if(Array.isArray(validator)) {
			this.validators = this.validators.concat(validator);
		} else {
			this.validators.push(validator);
		}

		return this;
	}

	addTransformer(transformer) {
		if(Array.isArray(transformer)) {
			this.transformers = this.transformers.concat(transformer);
		} else {
			this.transformers.push(transformer);
		}

		return this;
	}

	validate(value, force = false) {
		if((!this.options.strictMode || this.validators.length === 0) && !force) {
			return true;
		}

		return this.validators
			.some(validator => {
				return validator(value);
			});
	}

	transform(value) {
		if(this.transformers.length === 0) {
			return value;
		}

		return this.transformers
			.reduce((accumulator, transformer) => {
				return transformer(accumulator);
			}, value);
	}
}

class DataTypeFactory {
	static createDataType(file, className, options) {
		return new (require(file)[className])(options);
	}

	static createDateAndTime(className, options = {}) {
		return DataTypeFactory.createDataType('./date-and-time', className, options);
	}

	static createNumeric(className, options = {}) {
		return DataTypeFactory.createDataType('./numeric', className, options);
	}

	static createString(className, options = {}) {
		return DataTypeFactory.createDataType('./string', className, options);
	}
}

module.exports = { DataType, DataTypeFactory };
