const knex = require('../db/knex');
const getGameState = require('../GameState/getFormattedGameState');
const { getRoundCluesFromRound, getRoundCluesNotFromRound } = require('../GameState/getRoundClues');

const getParentConcepts = async (gameId) => {
  const parentConcepts = await knex
    .from('parent_concepts')
    .join('game_answers', 'parent_concepts.id', 'game_answers.parent_concept_id')
    .select('parent_concepts.id')
    .where('game_answers.game_id', gameId);

  return parentConcepts.map(({ id }) => id);
}

module.exports = async (parent, args, context, info) => {
  const gameId = args['id'];

  const gameState = await getGameState(gameId);

  const { currentRound } = gameState;

  console.log(gameState);

  const currentRoundClues = await getRoundCluesFromRound(
    currentRound,
    gameId
  );

  const otherRoundClues = await getRoundCluesNotFromRound(
    currentRound,
    gameId,
  );

  const parentConcepts = await getParentConcepts(gameId);

  return {
    ...gameState,
    parentConcepts,
    currentRoundClues,
    otherRoundClues,
  }
}
