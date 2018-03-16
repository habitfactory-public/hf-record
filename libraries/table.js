exports = module.exports = {};

const { ColumnFactory } = require('./column');

exports.Table = class Table {
	constructor(name, {columns = [], hooks = {}} = {}) {
		this._name = name;
		this._hooks = Object.assign({}, {
			beforeSave: [],
			beforeCreate: [],
			beforeUpdate: [],
			beforeReplace: [],
			beforeDelete: [],
			afterSave: [],
			afterCreate: [],
			afterUpdate: [],
			afterReplace: [],
			afterDelete: []
		}, hooks)

		this._columns = {};
		for(let column of columns) {
			this._columns[column.getName()] = column;
		}
	}

	getName() {
		return this._name;
	}

	getColumns() {
		return this._columns;
	}

	getColumn(name) {
		return this._columns[name];
	}

	getHook(name) {
		return this._hooks[name] || [];
	}

	runHook(name, value) {
		if(!(value instanceof Promise)) {
			value = Promise.resolve(value);
		}

		if(this.getHook(name).length === 0) {
			return value;
		}

		return this
			.getHook(name)
			.reduce((accumulator, current) => {
				return accumulator.then(current);
			}, value);
	}
};

exports.TableFactory = class TableFactory {
	static createTable(name, {columns = [], hooks = {}} = {}) {
		columns = columns.map(column => {
			return ColumnFactory.createColumn(column.name, column.dataType, column.attributes);
		});
		return new (exports.Table)(name, { columns, hooks });
	}
};
