const
	assert = require('chai').assert,
	{ Column, DataTypeFactory, TableFactory, Model } = require('../index');

// sample user model
class User extends Model {
	constructor({ connection = null, values = {}} = {}) {
		super({
			connection: connection,
			values: values,
			table: TableFactory.createTable('users', {
				columns: [
					{
						name: 'id',
						dataType: 'Int',
						attributes: {
							isPrimaryKey: true,
							isNotNull: true,
							isUnsigned: true,
							isReadonly: true,
							isAutoIncrement: true
						}
					},
					{
						name: 'name',
						dataType: 'Varchar',
						attributes: {
							isNotNull: true,
							length: 10
						}
					},
					{
						name: 'email',
						dataType: 'Varchar',
						attributes: {
							length: 45
						}
					},
					{
						name: 'password',
						dataType: 'Char',
						attributes: {
							length: 64
						}
					},
					{
						name: 'profile_image_url',
						dataType: 'Varchar',
						attributes: {
							length: 256
						}
					},
					{
						name: 'gender',
						dataType: 'Enum',
						attributes: {
							length: ['m', 'f', 'afab', 'agender', 'amab', 'androgyne', 'aporagender', 'bigender', 'binarism', 'binary', 'body-dysphoria', 'butch', 'cisgender', 'demigender', 'designated-gender', 'dyadic', 'femme', 'ftm', 'gender', 'gender-apathetic', 'gender-fluid', 'gender-neutral', 'gender-nonconforming', 'gender-presentation', 'gender-queer', 'gender-questioning', 'gender-roles', 'greygender', 'intergender', 'intersex', 'maverique', 'mtf', 'neither', 'neutrois', 'non-binary', 'novigender', 'other', 'pangender', 'polygender', 'sex', 'social-dysphoria', 'trans-feminine', 'trans-man', 'trans-masculine', 'trans-woman', 'transgender', 'transitioning', 'transsexual', 'two-spirit']
						}
					},
					{
						name: 'birthday',
						dataType: 'Date'
					},
					{
						name: 'created_at',
						dataType: 'Timestamp',
						attributes: {
							isNotNull: true,
							isReadonly: true,
							isMagicColumn: true
						}
					},
					{
						name: 'updated_at',
						dataType: 'Timestamp',
						attributes: {
							isNotNull: true,
							isReadonly: true,
							isMagicColumn: true
						}
					}
				],
				hooks: {}
			})
		})
	}
}

describe('model.js', () => {
	const user = new User({
			values: {
				id: 1,
				name: '이주헌',
				email: 'kirrie@gmail.com',
				password: '1234'
			}
		});

	describe('Model', () => {
		it('toJSON()', () => {
			assert.deepEqual(user.toJSON(), {
				name: '이주헌',
				email: 'kirrie@gmail.com',
				password: '1234'
			});
		});
		
		it('toJSON(true)', () => {
			assert.deepEqual(user.toJSON(true), {
				id: 1,
				name: '이주헌',
				email: 'kirrie@gmail.com',
				password: '1234'
			});
		});

		it('getTableName()', () => {
			assert.equal(user.getTableName(), 'users');
		});

		it('setTemp("temp", true), getTemp("temp")', () => {
			user.setTemp('temp', true);
			assert.isTrue(user.getTemp('temp'));
		});

		it('setTemp({a: 1, b: 2}), getTemp("a")', () => {
			user.setTemp({a: 1, b: 2});
			assert.equal(user.getTemp('a'), 1);
		});

		it('set("name", "박주헌"), get("name")', () => {
			user.set('name', '박주헌');
			assert.equal(user.get('name'), '박주헌');
		});

		it('set({name: "최주헌", email: "foo@bar.com"}), get("name")', () => {
			user.set({name: '최주헌', email: 'foo@bar.com'});
			assert.equal(user.get('name'), '최주헌');
		});

		it('set("nickname", "끼리에")', () => {
			assert.throw(() => {
				user.set('nickname', '끼리에');
			}, TypeError);
		});

		it('getPrimaryKeys()', () => {
			assert.deepEqual(user.getPrimaryKeys(), {id: 1});
		});

		it('getValues()', () => {
			assert.deepEqual(user.getValues(), {
				name: '최주헌',
				email: 'foo@bar.com',
				password: '1234'
			});
		});

		it('getWhere() #1', () => {
			assert.equal(user.getWhere(), 'id = 1');
		});

		it('getWhere() #2', () => {
			const user = new User({
					values: {
						name: '이주헌',
						email: 'kirrie@gmail.com',
						birthday: '1979-07-07'
					}
				});
			assert.equal(user.getWhere(), `name = '이주헌' AND email = 'kirrie@gmail.com' AND birthday = '1979-07-07'`);
		});

		it('getWhere() #3', () => {
			assert.equal(user.getWhere({
				query: 'name = ? AND password = ?',
				replacers: ['이주헌', '1234']
			}), `name = '이주헌' AND password = '1234'`);
		});

		
	});
});
