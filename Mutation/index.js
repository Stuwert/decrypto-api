const startGame = () => {
  if (CurrentGame.isFinished() || !CurrentGame.isStarted()) {
    return getCompiledWords().then((seedWords) => {
      // console.log("Seed Words are ", seedWords);
      return CurrentGame.startGame(seedWords);
    })
  }

  return CurrentGame.getGameState();
}


const checkAnswers = (parent, args, context, info) => {
  return CurrentGame.checkAnswers(args["guesses"]);
}

module.exports = {
  startGame,
  checkAnswers,
}
