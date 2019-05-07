
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('parent_child_concept_relationships').del()
    .then(function () {
      // Inserts seed entries
      return knex('parent_child_concept_relationships').insert([
        { id: 1, colName: 'synonyms' },
        { id: 2, colName: 'typeOf' },
        { id: 3, colName: 'examples' },
        { id: 4, colName: 'hasTypes' },
        { id: 5, colName: 'similarTo' },
      ]);
    });
};
