const
	{ ColumnFactory } = require('./column'),
	filter = require('filter-values');

Table = class Table {
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

	/**
	 * throws	TypeError		존재하지 않는 컬럼에 접근했을 경우
	 */
	getColumn(name) {
		if(this._columns[name] === undefined) {
			throw new TypeError(`${name} 컬럼은 존재하지 않습니다.`);
		}

		return this._columns[name];
	}

	getColumns() {
		return this._columns;
	}

	getFilteredColumns(filter) {
		return Object
			.values(this.getColumns())
			.filter(filter);
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
}

class TableFactory {
	static createTable(name, {columns = [], hooks = {}} = {}) {
		return new Table(name, {
			columns: columns.map(column => {
				return ColumnFactory.createColumn(column.name, column.dataType, column.attributes);
			}),
			hooks:hooks
		});
	}
}

module.exports = { Table, TableFactory };