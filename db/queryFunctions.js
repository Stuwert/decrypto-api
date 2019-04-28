let knex = require('./knex');

const findOne = async (tableName, where = {}) => knex
  .select()
  .table(tableName)
  .modify((queryBuilder) => {
    if (where && Object.keys(where).length > 0) queryBuilder.where(where);
  })
  .then(results => (results || []))[0];

const findAll = async (tableName, where = {}) => knex
  .select()
  .table(tableName)
  .modify((queryBuilder) => {
    if (where && Object.keys(where).length > 0) queryBuilder.where(where);
  })
  .limit(1)
  .then(results => (results || [])[0]);

module.exports = {
  findAll,
  findOne,
};
