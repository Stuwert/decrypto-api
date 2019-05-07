const knex = require('../db/knex');
const getGameState = require('../GameState/getFormattedGameState');
const { getRoundCluesFromRound, getRoundCluesNotFromRound } = require('../GameState/getRoundClues');
const { getParentConcepts } = require('../GameState/getParentConcepts');

module.exports = async (gameKey, overrideAnswers = false) => {
  const gameState = await getGameState(gameKey);
  const gameId = gameState.id;
  if (!gameId) {
    throw new Error('This game does not exist');
  }

  const { currentRound } = gameState;

  console.log(gameState);

  const currentRoundClues = await getRoundCluesFromRound(
    currentRound,
    gameId
  );

  console.log(overrideAnswers);

  const otherRoundClues = await getRoundCluesNotFromRound(
    currentRound,
    gameId,
    overrideAnswers,
  );

  const parentConcepts = await getParentConcepts(gameId);

  return {
    ...gameState,
    parentConcepts,
    currentRoundClues,
    otherRoundClues,
  }
}
