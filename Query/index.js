const knex = require('../db/knex');
const getGameState = require('./getGameState');
// const getGameAnswers = require('./getGameAnswers');

const showFinalGameStateWrapper = async (parent, args, context, info) => {
  const game = await getGameState(args['id']);

  if (!game.endedAt) {
    throw new Error('This game has not ended');
  }

  // const gameAnswers = await getGameAnswers(game.id);

  return {
    game,
    gameAnswers,
  }
};

const getGameStateWrapper = async (parent, args, context, info) => {
  return await getGameState(args['id']);
}

module.exports = {
  getGameState: getGameStateWrapper,
  showFinalGameState: showFinalGameStateWrapper,
}

// type GameState {
//   correctGuesses: Int
//   currentRound: Int!
//   currentRoundWords: [WordClue]
//   incorrectGuesses: Int
//   gameReady: Boolean!
//   guessedWords: [Word]
//   answers: [WordAnswer]
// }
