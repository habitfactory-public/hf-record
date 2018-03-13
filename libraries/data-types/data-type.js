class Transformed {
	constructor(value) {
		this._value = value;
		this._resolved = false;
	}

	resolve() {
		this._resolved = true;

		return this;
	}

	get resolved() {
		return this._resolved;
	}

	value(value) {
		if(value !== undefined) {
			this._value = value;
			return this;
		} else {
			return this._value;
		}
	}
}

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
				if(accumulator.resolved) {
					return accumulator;
				} else {
					return transformer(accumulator);
				}
			}, new Transformed(value))
			.value();
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
