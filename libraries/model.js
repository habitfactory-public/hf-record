const
	IS_TEST = process.env.NODE_ENV === 'test',
	isObject = require('isobject'),
	sqlstring = require('sqlstring'),
	path = require('path'),
	pluralize = require('pluralize'),
	isObjectEmpty = value => {
		return Object.keys(value).length === 0;
	},
	finder = ({ query = null, replacers = null }) => {
		if(query === null) {
			return '1 = 1';
		} else if(query !== null && replacers === null) {
			return query;
		} else {
			return sqlstring.format(query, replacers);
		}
	};

class Model {
	constructor({ table, connection, values }) {
		this._table = table;
		this._connection = connection;
		this._temp = {};
		this.set(values);
	}

	getTable() {
		return this._table;
	}

	getTableName() {
		return this.getTable().getName();
	}

	getConnection() {
		return this._connection;
	}

	getTemp(key) {
		return this._temp[key];
	}

	setTemp(key, value) {
		if(!isObject(key)) {
			this._temp[key] = value;
		} else {
			Object
				.entries(key)
				.forEach(value => {
					this._temp[value[0]] = value[1];
				});
		}

		return this;
	}

	get(key) {
		return this.getTable().getColumn(key).get();
	}

	/**
	 * `key` 이름을 가진 컬럼에 `value`를 설정한다.
	 * 
	 * @param {mixed} key 
	 * @param {mixed} value 
	 * @throws {TypeError} `value`가 컬럼의 조건을 만족하지 못하는 경우 TypeError가 발생할 수 있음. (isStrictMode가 true일 때)
	 * @returns {self}
	 */
	set(key, value) {
		if(!isObject(key)) {
			this.getTable().getColumn(key).set(value);
		} else {
			Object
				.entries(key)
				.forEach(value => {
					this.getTable().getColumn(value[0]).set(value[1]);
				});
		}

		return this;
	}

	getPrimaryKeys() {
		return this
			.getTable()
			.getFilteredColumns(column => column.isPrimaryKey() && column.get() !== undefined)
			.reduce((accumulator, current) => {
				accumulator[current.getName()] = current.get();
				return accumulator;
			}, {});
	}

	getValues() {
		return this
			.getTable()
			.getFilteredColumns(column => column.get() !== undefined && !column.isMagicColumn() && !column.isAutoIncrement())
			.reduce((accumulator, current) => {
				accumulator[current.getName()] = current.get();
				return accumulator;
			}, {});
	}

	getWhere({ query = null, replacers = null } = {}) {
		if(query === null) {
			let objects;
			if(!isObjectEmpty(this.getPrimaryKeys())) {
				objects = this.getPrimaryKeys();
			} else if(!isObjectEmpty(this.getValues())) {
				objects = this.getValues();
			}

			query = Object
				.keys(objects)
				.map(key => `\`${key}\` = ?`)
				.join(' AND ');
			replacers = Object.values(objects);
		}

		return finder({ query, replacers });
	}

	static findOne(connection, { query = null, replacers = null } = {}) {
		return connection
			.query(`SELECT * FROM ?? WHERE ${finder({ query, replacers })} LIMIT 1`, [(new this()).getTableName()])
			.then(rows => {
				if(rows.length > 0) {
					return new this({
						connection: connection,
						values: rows.shift()
					});
				 } else {
					 return null;
				 }
			});
	}

	static findAll(connection, { query = null, replacers = null } = {}) {
		return connection
			.query(`SELECT * FROM ?? WHERE ${finder({ query, replacers })}`, [(new this()).getTableName()])
			.then(rows => rows.map(row => new this({
				connection: connection,
				values: row
			})));
	}

	isExist({ query = null, replacers = null } = {}) {
		return this
			.getConnection()
			.query(`SELECT * FROM ?? WHERE ${this.getWhere({ query, replacers })}`, [this.getTableName()])
			.then(rows => {
				return rows.length > 0 ? this.set(rows.shift()) : null;
			});
	}

	save() {
		return this
			.getTable()
			.runHook('beforeSave', this)
			.then(self => {
				if(isObjectEmpty(this.getPrimaryKeys())) {
					return self.create();
				} else {
					return self.update();
				}
			})
			.then(self => {
				return self
					.getTable()
					.runHook('afterSave', self);
			});
	}

	create() {
		return this
			.getTable()
			.runHook('beforeCreate', this)
			.then(self => {
				const values = self.getValues();

				// 값이 설정되어있지 않은 상태로 create 명령을 실행하면
				// 실제 데이터베이스 조작은 하지 않고 자기 자신을 그대로 리턴한다.
				if(isObjectEmpty(values)) {
					return self
						.getTable()
						.runHook('afterCreate', self);
				} else {
					return self
						.getConnection()
						.query('INSERT INTO ?? (??) VALUES (?)', [self.getTableName(), Object.keys(values), Object.values(values)])
						.then(result => {
							if(result.insertId) {
								// 레코드 생성 후 insertId가 존재한다는 것은
								// auto increment 속성의 컬럼이 존재한다는 것이므로
								// 현재 객체의 가운데 auto increment 속성을 가진 
								// 컬럼의 값을 바꿔준다.
								// 일반적으로 auto increment 컬럼은 primary key임.
								self
									.getTable()
									.getFilteredColumns(column => column.isAutoIncrement())
									.forEach(column => {
										column.set(result.insertId);
									});
							}
							
							return self
								.getTable()
								.runHook('afterCreate', self);
						});
				}
			});
	}

	createIfNotExist({ query = null, replacers = null } = {}) {
		return this
			.isExist({ query, replacers })
			.then(result => {
				return result === null ? this.create() : this;
			});
	}

	update({ query = null, replacers = null } = {}) {
		return this
			.getTable()
			.runHook('beforeUpdate', this)
			.then(self => {
				const values = self.getValues();

				// 값이 설정되어있지 않은 상태로 update 명령을 실행하면
				// 실제 데이터베이스 조작은 하지 않고 자기 자신을 그대로 리턴한다.
				if(isObjectEmpty(values)) {
					return self
						.getTable()
						.runHook('afterUpdate', self);
				} else {
					return self
						.getConnection()
						.query(`UPDATE ?? SET ? WHERE ${this.getWhere({ query, replacers })}`, [this.getTableName(), values])
						.then(() => {
							return self
								.getTable()
								.runHook('afterUpdate', self);
						});
				}
			});
	}

	replace({ query = null, replacers = null } = {}) {
		return this
			.isExist({ query, replacers })
			.then(old => {
				if(old === null) {
					return this.create();
				} else {
					return old
						.delete()
						.then(() => this.create());
				}
			});
	}

	delete() {
		return this
			.getTable()
			.runHook('beforeDelete', this)
			.then(self => {
				if(isObjectEmpty(self.getPrimaryKeys())) {
					// primary key가 없는 경우는 삭제하지 않는다.
					// 한번에 다량의 레코드를 삭제하려면 findAll을 통해
					// 검색된 객체를 삭제하는 방식으로 해야한다.

					return self
						.getTable()
						.runHook('afterDelete', self);					
				} else {
					return self
						.getConnection()
						.query(`DELETE FROM ?? WHERE ${self.getWhere()}`, [self.getTableName()])
						.then(() => {
							return self
								.getTable()
								.runHook('afterDelete', self);
						});
				}
			});
	}

	toJSON(reveal = false) {
		return this
			.getTable()
			.getFilteredColumns(column => (reveal || !column.isPrimaryKey()) && column.get() !== undefined)
			.reduce((accumulator, current) => {
				accumulator[current.getName()] = current.get();
				return accumulator;
			}, {});
	}
}

class ModelLoader {
	constructor({ path = './models', ucfirstExceptions = {}} = {}) {
		this._basePath = path;
		this._classes = {};
		this._ucfirstExceptions = Object.assign({
			'oauth': 'OAuth'
		}, ucfirstExceptions);
	}

	load(files) {
		if(typeof files === 'string') {
			if(files.indexOf(',') >= 0) {
				files = files
					.split(',')
					.map(file => file.trim());
			} else {
				files = [files];
			}
		} else if(Array.isArray(files)) {
			files = files.map(file => file.trim());
		} else {
			throw new TypeError(files);
		}

		return files
			.reduce((accumulator, current) => {
				current = current.toLowerCase();
				accumulator[this.getClassName(current)] = this.loadClass(current);
				return accumulator;
			}, {});
	}

	loadClass(file) {
		if(this._classes[file] === undefined) {
			this._classes[file] = require(this.getClassPath(file));
		}
		return this._classes[file];
	}

	getClassPath(file) {
		return path.join(this._basePath, file);
	}

	getClassName(file) {
		return file
			.split('_')
			.map(token => this.getUcfirst(pluralize.singular(token)))
			.join('');
	}

	getUcfirst(word) {
		return this._ucfirstExceptions[word] || word.charAt(0).toUpperCase() + word.slice(1);
	}
}

const
	modelLoaders = {},
	getModelLoader = ({ path = './models', ucfirstExceptions = {} } = {}) => {
		if(modelLoaders[path] === undefined) {
			modelLoaders[path] = new ModelLoader({ path, ucfirstExceptions });
		}
		return modelLoaders[path];
	};

module.exports = { Model, ModelLoader, getModelLoader };