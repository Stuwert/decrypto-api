
exports.up = function (knex, Promise) {
  knex.schema.dropTable('game_clues');
};

exports.down = function (knex, Promise) {
  knex.schema.createTable('game_clues', (gameClues) => {
    table.increments('id').primary();
    table.integer('child_concept_id').references('child_concepts.id');
    table.integer('game_answer_id').references('game_answers.id');
    table.integer('user_guessed_answer_id').references('game_answers.id');
    table.integer('sequence_location');
    table.integer('game_round_id').references('game_rounds.id');
  });

};
