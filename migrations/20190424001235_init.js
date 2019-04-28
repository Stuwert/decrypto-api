
exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('games', (table) => {
      table.increments('id').primary();
      table.timestamps();
      table.integer('correct_guess_count');
      table.integer('incorrect_guess_count');
      table.dateTime('ended_at');
      table.jsonb('remaining_sequences');
    })
    .createTable('game_rounds', (table) => {
      table.increments('id').primary();
      table.timestamps();
      table.integer('game_id').references('games.id');
      table.integer('round_id');
      table.jsonb('clue_sequence');// Might not need this but I'm storing it anyway
      table.unique(['game_id', 'round_id']); //  A game should only have 1 round  once
    })
    .createTable('parent_concepts', (table) => {
      table.increments('id').primary();
      table.timestamps();
      table.string('name').unique();
    })
    .createTable('child_concepts', (table) => {
      table.increments('id').primary();
      table.timestamps();
      table.string('name').unique();
    })
    .createTable('game_answers', (table) => {
      table.increments('id').primary();
      table.integer('parent_concept_id').references('parent_concepts.id');
      table.integer('game_id').references('games.id');
    })
    .createTable('game_clues', (table) => {
      table.increments('id').primary();
      table.integer('child_concept_id').references('child_concepts.id');
      table.integer('game_answer_id').references('game_answers.id');
      table.integer('user_guessed_answer_id').references('game_answers.id');
      table.integer('sequence_location');
      table.integer('game_round_id').references('game_rounds.id');
    })
    .createTable('concept_relationship_types', (table) => {
      table.increments();
      table.string('title');
    })
    .createTable('parent_child_concept_relationships', (table) => {
      table.timestamps();
      table.integer('parent_concept_id').references('parent_concepts.id');
      table.integer('child_concept_id').references('child_concepts.id');
      table.integer('concept_relationship_type_id').references('concept_relationship_types.id')
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTable('parent_child_concept_relationships')
    .dropTable('concept_relationship_types')
    .dropTable('game_clues')
    .dropTable('game_answers')
    .dropTable('child_concepts')
    .dropTable('parent_concepts')
    .dropTable('game_rounds')
    .dropTable('games');
};
