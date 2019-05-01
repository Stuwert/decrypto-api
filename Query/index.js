const knex = require('../db/knex');

const getGameState = async (parent, args, context, info) => {
  const game = knex('games')
    .where({ id: args['id'] });

  const guessedWords = knex('game_clues')
    .join('child_concept_id', 'game_clues.child_concept_id', 'child_concepts.id')
    .where('game_clues.game_id', args['id'])

  return {
    ...game,
    guessedWords,
  }

}

const getGameState = () => CurrentGame.getGameState();

const showAnswers = () => CurrentGame.showAnswers();

module.exports = {
  getGameState,
  showAnswers,
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
