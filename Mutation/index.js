const checkAnswers = require('../GameState/checkAnswers');

const setupGame = require('../GameState/initializeGame/setUpGame');
const generateNewRound = require('../GameState/generateNewRound');

const startGame = async () => {
  const gameState = await setupGame();
  await generateNewRound(gameState);

  return gameState.id;
}


const checkAnswersWrapper = async (parent, args, context, info) => {
  return await checkAnswers(
    args['guesses'],
    args['gameId']
  )
}

module.exports = {
  startGame,
  checkAnswers: checkAnswersWrapper,
}
