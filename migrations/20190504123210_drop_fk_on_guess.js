
exports.up = function (knex, Promise) {
  return knex.schema.table('game_clues', (gameClue) => {
    gameClue.dropForeign('user_guessed_parent_concept_id')
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('game_clues', (gameClue) => {
    gameClue.integer('user_guessed_parent_concept_id').references('parent_concepts.id').alter();
  })
};
