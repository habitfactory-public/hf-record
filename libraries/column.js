exports = module.exports = {};

const { DataTypeFactory } = require('./data-types/data-type');

class ColumnValue {
	constructor() {
		this._value = undefined;
		this._originalValue = undefined;
	}

	set(value) {
		if(value !== undefined) {
			this._value = value;

			if(this._originalValue === undefined) {
				this._originalValue = value;
			}
		}
	}

	get() {
		return this._value;
	}

	isChanged() {
		if(this._value === undefined && this._originalValue === undefined) {
			return false;
		}

		if(this._value === this._originalValue) {
			return false;
		} else {
			return true;
		}
	}
}

exports.Column = class Column {
	constructor(name, dataType, attributes = {}) {
		this._value = new ColumnValue();
		this._name = name;
		this._attributes = Object.assign({}, {
			isPrimaryKey: false,
			isNotNull: false,
			isBinary: false,
			isUnsigned: false,
			isZeroFill: false,
			isReadonly: false,
			isMagicColumn:false
		}, attributes);
		this._dataType = dataType;
	}

	getName() {
		return this._name;
	}

	getDataType() {
		return this._dataType;
	}

	isPrimaryKey() {
		return this._attributes.isPrimaryKey;
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

	isReadonly() {
		return this._attributes.isReadonly;
	}

	isMagicColumn() {
		return this._attributes.isMagicColumn;
	}

	set(value) {
		if(this.getDataType().validate(value)) {
			this._value.set(this.getDataType().transform(value));
		}
	}

	get() {
		return this._value.get();
	}

	isChanged() {
		return this._value.isChanged();
	}
};

exports.ColumnFactory = class ColumnFactory {
	static createColumn(name, dataTypeClassName, attributes = {}) {
		attributes = Object.assign({}, {
			isPrimaryKey: false,
			isNotNull: false,
			isBinary: false,
			isUnsigned: false,
			isZeroFill: false,
			isReadonly: false,
			isMagicColumn:false
		}, attributes);
		return new (exports.Column)(
			name, 
			DataTypeFactory[`create${dataTypeClassName}`](attributes), 
			attributes
		);
	}
};
