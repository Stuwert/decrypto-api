
exports.up = function (knex, Promise) {
  return knex.schema.createTable('external_requests', (table) => {
    table.increments('id').primary();
    table.string('request_account_name');
    table.date('request_date');
    table.integer('daily_count');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('external_requests');
};
