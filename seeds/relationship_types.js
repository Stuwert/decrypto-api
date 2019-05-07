
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('concept_relationship_types').del()
    .then(function () {
      // Inserts seed entries
      return knex('concept_relationship_types').insert([
        { id: 1, title: 'synonyms' },
        { id: 2, title: 'typeOf' },
        { id: 3, title: 'examples' },
        { id: 4, title: 'hasTypes' },
        { id: 5, title: 'similarTo' },
      ]);
    });
};
