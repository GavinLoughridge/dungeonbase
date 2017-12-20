// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'dungeonbase',
      user:     'xkrhtsbo',
      password: 'avwwoqbk'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      host: 'ec2-184-72-228-128.compute-1.amazonaws.com',
      database: 'd33hktg9u0og8u',
      user:     'dfimreypyxkshu',
      password: '1380d5d5611159e48c7d7a663768d6e4b4077abed016eec28b1d055f18302c29'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
