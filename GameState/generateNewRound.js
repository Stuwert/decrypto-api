const knex = require('../db/knex');
const moment = require('moment');


const getNextGameClue = (gameId) => async (parentConceptId) => {
  const [{available_child_concepts: childConcepts}] = await knex('game_answers').select('available_child_concepts')
    .where({
      game_id: gameId,
      parent_concept_id: parentConceptId
    });

  console.log(childConcepts.length);
  const childConceptId = childConcepts.pop();

  console.log(childConcepts.length);

  await knex('game_answers').where({
    game_id: gameId,
    parent_concept_id: parentConceptId
  }).update({
    available_child_concepts: JSON.stringify(childConcepts)
  });

  return {
    childConceptId,
    parentConceptId
  };
}

const generateRoundSequence = async (gameState) => {
  const keys = [
    "threeLengthSequences",
    "twoLengthSequences",
    "fourLengthSequences",
  ];

  const {
    remaining_sequences: remainingSequences,
    correct_guess_count: correctGuessCount,
    id: gameId
  } = gameState;

  const parentSequence = remainingSequences[keys[correctGuessCount]].pop();

  await knex('games').where({ id: gameId })
    .update({ remaining_sequences: remainingSequences })

  const getNextClue = getNextGameClue(gameState.id);
  return await Promise.all(parentSequence.map(getNextClue));
}

const createGameRound = async (gameState) => {
  console.log("Starting at ", moment().format())
  const childIdSequence = await generateRoundSequence(gameState)

  await knex('game_rounds').insert({
    created_at: moment(),
    updated_at: moment(),
    game_id: gameState.id,
    round_id: gameState.roundCount + 1, // This is not a thing... lol
    clue_sequence: JSON.stringify(childIdSequence),
  })
  console.log("Ending at ", moment().format())

}

module.exports = createGameRound;
