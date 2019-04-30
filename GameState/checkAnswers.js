
const compareGuessToAnswer = (
  currentRoundWords,
  { word: guessWord, guess }
) => {
  const foundWord = currentRoundWords.find(({ word }) => word === guessWord);

  if (foundWord === undefined) {
    throw new Error('You are not guessing a valid sequence');
  }

  const { answer } = foundWord;
  return answer === guess;
};

const incrementedCounts = (checkedAnswers) => {
  const includesIncorrect = checkedAnswers.find(({ isCorrect }) => isCorrect === false)

  if (includesIncorrect) {
    return [0, 1];
  }
  return [1, 0];
}

const


const checkAnswers = async (userGuesses, gameId, gameRoundId) => {
  // this.checkGameReady();

  // if (userGuesses.length !== this.currentRoundWords.length) {
  //   throw new Error("You must make exactly 3 guesses");
  // }

  const currentRoundWords = await knex.from('games')
    .joinRaw('game_clues.id = games.id AND game_clues.game_round = games.current_round')
    .select('game_clues')
    .where('games.id', gameId)
    .orderBy('game_clues.sequence_location');

  // set show answer
  // user guess
  userGuesses.map()

  knex.where({
    game_id: gameId,
    game_round: gameRoundId,
  }).onNotNull('user_guessed_parent_concept_id')

  // This could technically lead to them being re-ordered...
  const answeredWords = userGuesses.map(
    (guessWord, wordIndex) => ({
      ...currentRoundWords[wordIndex],
      isCorrect: compareGuessToAnswer(currentRoundWords, guessWord),
      guess: guessWord.guess,
      roundNumber,
    })
  );

  const answeredWordsWithAnswers = answeredWords.map(pickAnswerToShow);

  // update game state
  const [addToCorrect, addToIncorrect] = incrementedCounts(answeredWords);

  this.correctGuesses = this.correctGuesses + addToCorrect;
  this.incorrectGuesses = this.incorrectGuesses + addToIncorrect;
  this.guessedWords = this.guessedWords.concat(answeredWordsWithAnswers);
  this.currentRound++;

  if (this.correctGuesses >= 3) {
    this.hasBeenCompleted = true;


    return answeredWordsWithAnswers;
  }

  this.generateRoundClues();

  return answeredWordsWithAnswers;
}
