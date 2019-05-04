const knex = require('../../db/knex');
const moment = require('moment');
const generateRandomizedSequences = require('./generateRandomizedSequences');
const setUpWordsAndRelationships = require('./addNewWordsAndRelationshipsToDatabase');
const shuffle = require('../../Utilities/shuffle');
const uuid = require('uuid/v4');

// generate randomized clue set
// Start new game with defaults
// Add game answers
//
// generate first clue set

const generateGameKey = () => uuid().split('-')[0];

const createGameAnswer = (parentId, gameId, childIds) => {
  return knex('game_answers').insert({
    parent_concept_id: parentId,
    game_id: gameId,
    available_child_concepts: JSON.stringify(shuffle(childIds)),
  });
}

const storeGameAnswers = async (newGame) => {
  const { id, parentWordIds } = newGame;
  const parentChildRelationships = await knex.from('parent_child_concept_relationships')
    .whereIn('parent_concept_id', parentWordIds)
    .select(
      'parent_concept_id AS parentConceptId',
      'child_concept_id AS childConceptId'
    );

  await Promise.all(parentWordIds.map(
    (parentId, index) => createGameAnswer(
      parentId,
      id,
      parentChildRelationships
        .filter(({ parentConceptId }) => parentId === parentConceptId)
        .map(({ childConceptId }) => childConceptId),
    )
  ));

  return {
    ...newGame,
    correct_guess_count: 0,
    current_round: 1,
  };
}

const initializeNewGame = (parentWordIds) => {
  const randomizedSequences = generateRandomizedSequences(parentWordIds);
  const key = generateGameKey();
  return knex('games')
    .insert({
      created_at: moment(),
      updated_at: moment(),
      correct_guess_count: 0,
      incorrect_guess_count: 0,
      remaining_sequences: randomizedSequences,
      current_round: 1,
      key,
    })
    .returning('id')
    .then((newGameId) => ({ id: newGameId[0], parentWordIds, remaining_sequences: randomizedSequences, key }))
}

const setupGame = async () => {
  const parentWordsIds = await setUpWordsAndRelationships();
  const newGame = await initializeNewGame(parentWordsIds);

  return await storeGameAnswers(newGame);
}

module.exports = setupGame;
