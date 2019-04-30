const knex = require('../db/knex');
const moment = require('moment');


const getNextGameClue = ({ id: gameId, roundCount }) => async (parentConceptId, index) => {
  const [{ available_child_concepts: childConcepts }] = await knex('game_answers').select('available_child_concepts')
    .where({
      game_id: gameId,
      parent_concept_id: parentConceptId
    });
  const childConceptId = childConcepts.pop();

  await knex('game_answers').where({
    game_id: gameId,
    parent_concept_id: parentConceptId
  }).update({
    available_child_concepts: JSON.stringify(childConcepts)
  });

  await knex('game_clues').insert({
    child_concept_id: childConceptId,
    parent_concept_id: parentConceptId,
    sequence_location: index + 1,
    game_id: gameId,
    game_round: roundCount + 1,
  })

  return childConceptId;
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

  const getNextClue = getNextGameClue(gameState);
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
  })
  console.log("Ending at ", moment().format())

}
// createGameRound({
//   roundCount: 1,
//   id: 27,
//   correct_guess_count: 0,
//   remaining_sequences: { "twoLengthSequences": [[13, 29], [31, 13], [28, 13], [29, 32], [28, 31], [28, 29], [28, 32], [13, 28], [29, 28], [13, 31], [32, 13], [29, 31], [31, 28], [13, 32], [31, 32], [32, 31], [29, 13], [32, 29], [32, 28], [31, 29]], "fourLengthSequences": [[13, 31, 29, 28], [28, 31, 29, 32], [28, 29, 13, 32], [28, 29, 13, 31], [29, 28, 13, 31], [13, 32, 28, 31], [29, 31, 28, 32], [13, 32, 29, 28], [32, 29, 31, 13], [32, 28, 29, 31], [13, 29, 28, 31], [28, 31, 13, 29], [13, 28, 31, 29], [29, 28, 32, 31], [29, 13, 31, 32], [28, 13, 31, 32], [28, 32, 31, 13], [13, 28, 32, 29], [31, 29, 28, 32], [29, 31, 32, 28], [31, 29, 13, 32], [31, 29, 13, 28], [13, 29, 32, 28], [31, 28, 29, 32], [32, 28, 31, 13], [28, 13, 32, 31], [13, 32, 29, 31], [32, 29, 13, 31], [32, 31, 13, 29], [28, 13, 32, 29], [28, 32, 13, 31], [29, 31, 28, 13], [31, 13, 32, 29], [13, 29, 31, 28], [29, 28, 13, 32], [32, 29, 28, 31], [32, 31, 28, 29], [31, 29, 28, 13], [29, 32, 13, 31], [29, 32, 31, 28], [32, 13, 28, 31], [29, 32, 31, 13], [29, 13, 32, 28], [29, 13, 28, 31], [32, 28, 13, 29], [13, 31, 32, 29], [28, 31, 13, 32], [31, 29, 32, 13], [31, 28, 32, 13], [28, 31, 32, 13], [13, 32, 31, 29], [29, 13, 28, 32], [29, 31, 13, 28], [31, 32, 13, 29], [28, 13, 29, 31], [13, 32, 31, 28], [32, 31, 29, 13], [32, 13, 29, 31], [32, 29, 28, 13], [28, 13, 31, 29], [32, 31, 29, 28], [32, 13, 28, 29], [29, 28, 32, 13], [28, 31, 29, 13], [31, 13, 32, 28], [13, 31, 28, 32], [29, 28, 31, 13], [13, 29, 31, 32], [32, 29, 31, 28], [31, 32, 28, 13], [13, 28, 32, 31], [28, 32, 31, 29], [31, 13, 29, 28], [28, 29, 32, 31], [13, 29, 32, 31], [29, 13, 32, 31], [28, 29, 32, 13], [31, 29, 32, 28], [28, 31, 32, 29], [31, 28, 13, 32], [31, 13, 28, 29], [13, 31, 28, 29], [13, 28, 29, 31], [13, 28, 29, 32], [31, 28, 32, 29], [31, 28, 13, 29], [31, 13, 28, 32], [13, 32, 28, 29], [13, 31, 32, 28], [31, 32, 13, 28], [28, 32, 29, 31], [13, 29, 28, 32], [28, 32, 13, 29], [31, 32, 29, 28], [28, 29, 31, 13], [29, 28, 31, 32], [29, 31, 13, 32], [29, 32, 28, 31], [31, 32, 28, 29], [29, 31, 32, 13], [31, 32, 29, 13], [32, 13, 31, 29], [28, 29, 31, 32], [29, 32, 28, 13], [32, 13, 29, 28], [13, 28, 31, 32], [32, 29, 13, 28], [32, 28, 29, 13], [32, 28, 13, 31], [32, 13, 31, 28], [13, 31, 29, 32], [32, 31, 13, 28], [29, 32, 13, 28], [32, 31, 28, 13], [29, 13, 31, 28], [28, 32, 29, 13], [32, 28, 31, 29], [28, 13, 29, 32], [31, 28, 29, 13], [31, 13, 29, 32]], "threeLengthSequences": [[13, 32, 31], [31, 28, 32], [29, 13, 32], [31, 29, 32], [31, 29, 28], [31, 28, 13], [31, 32, 13], [29, 32, 31], [28, 29, 32], [28, 29, 13], [29, 32, 13], [32, 28, 13], [28, 31, 13], [31, 13, 32], [29, 28, 31], [32, 29, 28], [13, 31, 29], [13, 32, 29], [29, 28, 13], [32, 28, 29], [29, 13, 31], [13, 28, 29], [13, 29, 28], [29, 32, 28], [32, 28, 31], [32, 13, 29], [13, 31, 32], [31, 28, 29], [28, 13, 31], [29, 31, 13], [31, 13, 29], [13, 32, 28], [32, 13, 31], [32, 31, 13], [28, 31, 32], [28, 31, 29], [28, 13, 32], [32, 29, 31], [28, 32, 13], [28, 13, 29], [31, 32, 29], [28, 29, 31], [29, 13, 28], [28, 32, 31], [31, 29, 13], [13, 29, 32], [13, 28, 32], [31, 13, 28], [28, 32, 29], [32, 31, 28], [32, 29, 13], [29, 31, 28], [13, 31, 28], [29, 28, 32], [32, 13, 28], [29, 31, 32], [13, 29, 31], [32, 31, 29], [13, 28, 31]] }
// });
module.exports = createGameRound;
