
exports.up = function (knex, Promise) {
  return knex.schema.table('game_clues', (gameClues) => {
    gameClues.boolean('show_answer').defaultTo(false);
    gameClues.integer('game_id').references('games.id');
    gameClues.dropColumn('game_answer_id');
    gameClues.dropColumn('user_guessed_answer_id');
    gameClues.integer('user_guessed_parent_concept_id').references('parent_concepts.id');
    gameClues.integer('parent_concept_id').references('parent_concepts.id');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.table('game_clues', (gameClues) => {
    gameClues.dropColumn('show_answer');
    gameClues.dropColumn('game_id');
    gameClues.integer('game_answer_id').references('game_answers.id');
    gameClues.dropColumn('user_guessed_parent_concept_id');
    gameClues.integer('user_guessed_answer_id').references('game_answers.id');
    gameClues.dropColumn('parent_concept_id');
  })
};
