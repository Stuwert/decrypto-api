// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'cipher'
    },
    postProcessResponse: (result, queryContext) => {
      // TODO: add special case for raw results (depends on dialect)
      if (Array.isArray(result)) {
        return result.map(row => convertToCamel(row));
      } else {
        return convertToCamel(result);
      }
    }
  },

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};
