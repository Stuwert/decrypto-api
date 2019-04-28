
exports.up = function (knex, Promise) {
  return knex.schema.table('game_answers', (gameAnswers) => {
    gameAnswers.integer('game_sequence_id');
    gameAnswers.unique(['game_id', 'game_sequence_id']); //  A game should only have 1 round  once
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.table('game_answers', (gameAnswers) => {
    gameAnswers.dropUnique(['game_id', 'game_sequence_id']); //  A game should only have 1 round  once
    gameAnswers.dropColumn('game_sequence_id');
  })
};
