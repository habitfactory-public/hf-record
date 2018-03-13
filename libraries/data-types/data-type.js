const _ = require('underscore');

class DataType {
	constructor(options = {}) {
		this.options = _.defaults(options, {
			strictMode: true
		});
		this.validators = [];
		this.transformers = [];
	}

	addValidator(validator) {
		if(_.isArray(validator)) {
			this.validators = this.validators.concat(validator);
		} else {
			this.validators.push(validator);
		}

		return this;
	}

	addTransformer(transformer) {
		if(_.isArray(transformer)) {
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
			.reverse()
			.every(validator => {
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
