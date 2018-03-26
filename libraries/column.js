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
			isStrictMode: true,
			isPrimaryKey: false,
			isNotNull: false,
			isBinary: false,
			isUnsigned: false,
			isZeroFill: false,
			isReadonly: false,
			isMagicColumn: false,
			isAutoIncrement: false
		}, attributes);
		this._dataType = dataType;
	}

	getName() {
		return this._name;
	}

	getDataType() {
		return this._dataType;
	}

	isStrictMode() {
		return this._attributes.isStrictMode;
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

	isAutoIncrement() {
		return this._attributes.isAutoIncrement;
	}

	isReadonly() {
		return this._attributes.isReadonly;
	}

	isMagicColumn() {
		return this._attributes.isMagicColumn;
	}

	set(value) {
		// strict mode면서 not null 속성을 가졌지만 null을 입력하려고 할때는
		// TypeError를 발생.
		if(this.isStrictMode() && this.isNotNull() && value === null) {
			throw new TypeError(`${this.getName()} can't be null.`);
		}

		// readonly인 경우는 값을 처음 한 번만 입력할 수 있음. (변경 불가)
		if(this.isReadonly() && this._value.get() !== undefined) {
			return false;
		}

		// primary key인 경우는 값을 처음 한 번만 입력할 수 있음.
		// 또한 null은 입력 불가 (변경 불가)
		if(this.isPrimaryKey() && (this._value.get() !== undefined || value === null)) {
			return false;
		}
		
		if(this.getDataType().validate(value)) {
			this._value.set(this.getDataType().transform(value));
			return true;
		}

		return false;
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
			isMagicColumn: false,
			isAutoIncrement: false
		}, attributes);
		return new (exports.Column)(
			name, 
			DataTypeFactory[`create${dataTypeClassName}`](attributes), 
			attributes
		);
	}
};
