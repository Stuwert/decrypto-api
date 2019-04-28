
exports.up = function (knex, Promise) {
  return knex.schema.table('game_answers', (gameAnswers) => {
    gameAnswers.jsonb('available_child_concepts');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.table('game_answers', (gameAnswers) => {
    gameAnswers.dropColumn('available_child_concepts');
  })
};
