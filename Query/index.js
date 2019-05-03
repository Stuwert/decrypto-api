const knex = require('../db/knex');
const getGameState = require('./getGameState');

const showFinalGameState = () => { };

module.exports = {
  getGameState,
  showFinalGameState,
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
