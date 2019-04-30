const knex = require('../../db/knex');
const moment = require('moment');
const generateRandomizedSequences = require('./generateRandomizedSequences');
const setUpWordsAndRelationships = require('./addNewWordsAndRelationshipsToDatabase');
const shuffle = require('../../Utilities/shuffle');

// generate randomized clue set
// Start new game with defaults
// Add game answers
//
// generate first clue set

const parentClueIds = [13, 29, 28, 31, 32];

const createGameAnswer = (parentId, gameId, childIds) => {
  console.log(parentId);
  console.log(childIds.length)
  console.log(childIds);
  return knex('game_answers').insert({
    parent_concept_id: parentId,
    game_id: gameId,
    available_child_concepts: JSON.stringify(shuffle(childIds)),
  }).then((results) => console.log(results))
}

const storeGameAnswers = (newGame) => {
  const { newGameId, parentWordIds } = newGame;
  return knex.from('parent_child_concept_relationships')
    .whereIn('parent_concept_id', parentClueIds)
    .select(
      'parent_concept_id AS parentConceptId',
      'child_concept_id AS childConceptId'
    )
    .then((parentChildRelationships) => {
      return parentWordIds.map(
        (parentId, index) => createGameAnswer(
          parentId,
          newGameId,
          parentChildRelationships
            .filter(({ parentConceptId }) => parentId === parentConceptId)
            .map(({ childConceptId }) => childConceptId),
        )
      )
    })
    .then(() => ({ ...newGame, roundCount: 0 }));
}

const initializeNewGame = (parentWordIds) => {
  // setUpWordsAndRelationships().then()
  const randomizedSequences = generateRandomizedSequences(parentWordIds);
  return knex('games')
    .insert({
      created_at: moment(),
      updated_at: moment(),
      correct_guess_count: 0,
      incorrect_guess_count: 0,
      remaining_sequences: randomizedSequences
    })
    .returning('id')
    .then((newGameId) => ({ newGameId: newGameId[0], parentWordIds }))
}

const startGame = (parentWordIds) => {
  return initializeNewGame(parentWordIds)
    .then((newGame) => storeGameAnswers(newGame))
}

startGame(parentClueIds);
