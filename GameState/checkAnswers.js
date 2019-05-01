const moment = require("moment");

const incrementedCounts = (checkedAnswers) => {
  const includesIncorrect = checkedAnswers.find(({ isCorrect }) => isCorrect === false)

  if (includesIncorrect) {
    return [0, 1];
  }
  return [1, 0];
}



const updateAndStripAnswer = (guessedWord, index, checkedAnswers) => {
  const { isCorrect, guess } = guessedWord;

  if (isCorrect) return { ...guessedWord, showAnswer: true };

  // We will allow users to see 1 fewer answers than the number of incorrect guesses
  // i.e. if they have 3 incorrect guesses they will see 2 answers.
  // If no answers are incorrect, the code will never reach here.
  const incorrectWordsToShowAnswer = checkedAnswers.filter(({ isCorrect }) => !isCorrect).slice(0, -1);

  const showAnswer = incorrectWordsToShowAnswer.indexOf(guessedWord) !== -1;

  const gameClue = await knex('game_clues')
    .where({ id: gameClueId })
    .update({
      user_guessed_parent_concept_id: guess,
      show_answer: showAnswer;
    });

  const
}

const setWordAnswer = (userGuessId, showAnswer = false) => {
  return await knex('game_clues').where({
    id: gameClueId,
  }).update({
    user_guessed_parent_concept_id: userGuessId,
    show_answer: showAnswer,
  });
}

const getUpdateStatementFromCluesAndGuesses = (
  userGuesses,
  { name, gameClueId, parentConceptId }
) => {
  const userGuess = userGuesses.find(({ word }) => word === name);

  return {
    guess,
    isCorrect: guess === parentConceptId
    parentConceptId,
    name,
    gameClueId,
  }
}

const shouldGameEnd = (correctGuessCount) => {
  if (correctGuessCount >= 3) return moment();

  return null;
}

const checkAnswers = async (userGuesses, gameId, gameRoundId) => {

  /**
   * Guess
   * word: String!
   * guess: Int!
   */
  // this.checkGameReady();

  // if (userGuesses.length !== this.currentRoundWords.length) {
  //   throw new Error("You must make exactly 3 guesses");
  // }

  // const currentRoundWords = await knex.from('games')
  //   .joinRaw('game_clues.id = games.id AND game_clues.game_round = games.current_round')
  //   .select('game_clues')
  //   .where('games.id', gameId)
  //   .orderBy('game_clues.sequence_location');

  // set show answer
  // user guess

  const roundClues = await knex('round_clues')
    .select(
      'child_concepts.name AS name',
      'game_clues.id AS gameClueId'
      'game_clues.parent_concept_id AS parentConceptId'
    )
    .join('child_concepts', 'round_clues.child_concept_id', 'child_concepts.id')
    .where({
      game_id: gameId,
      game_round: gameRoundId,
    });

  const answeredWords = roundClues.map((roundClue) => ({
    ...getUpdateStatementFromCluesAndGuesses(userGuesses, roundClue),
  }))

  // TODO - Change this to strip out the answers from the response
  const strippedAnswers = await Promise.all(answeredWords.map(insertAndStripAnswer));

  // update game state
  const [addToCorrect, addToIncorrect] = incrementedCounts(answeredWords);
  const incrementedCorrect = correctGuesses + addToCorrect;
  const incrementedIncorrect = incorrectGuesses + addToIncorrect;
  // update game
  //
  const updatedGameState = await knex('games').where({ id: gameId })
    .update({
      correct_guess_count: incrementedCorrect,
      incorrect_guess_count: incrementedIncorrect,
      current_round: currentRound + 1
      ended_at: shouldGameEnd(incrementedCorrect, incrementedIncorrect)
    })
    .returning(
      'id',
      'current_round',
      'correct_guess_count',
      'remaining_sequences'
    );

  return await generateRoundClues(updatedGameState);
}
