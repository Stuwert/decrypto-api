
exports.up = function (knex, Promise) {
  return knex.schema.table('parent_child_concept_relationships', (table) => {
    table.unique(['parent_concept_id', 'child_concept_id'])
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('parent_child_concept_relationships', (table) => {
    table.dropUnique(['parent_concept_id', 'child_concept_id'])
  });
};
