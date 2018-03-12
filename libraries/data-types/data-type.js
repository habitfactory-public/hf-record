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

		return _.chain(this.validators)
			.reverse()
			.every(validator => {
				return validator(value);
			})
			.value();
	}

	transform(value) {
		if(this.transformers.length === 0) {
			return value;
		}

		return _.chain(this.transformers)
			.reduce((accumulator, transformer) => {
				return transformer(accumulator);
			}, value)
			.value();
	}
}

module.exports = { DataType };
