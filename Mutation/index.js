const setupGame = require('../GameState/initializeGame/setUpGame');
const generateNewRound = require('../GameState/generateNewRound');

const startGame = async () => {
  const gameState = await setupGame();
  await generateNewRound(gameState);

  return gameState.id;
}


const checkAnswers = (parent, args, context, info) => {
  return CurrentGame.checkAnswers(args["guesses"]);
}

module.exports = {
  startGame,
  checkAnswers,
}
