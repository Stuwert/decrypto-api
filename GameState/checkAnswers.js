const moment = require("moment");
const getGameState = require('./getFormattedGameState');
const generateNewRound = require('./generateNewRound');
const { getRoundCluesFromRound, formatClue } = require('./getRoundClues');
const knex = require('../db/knex');

const incrementUserGuessCounts = (checkedAnswers) => {
  const includesIncorrect = checkedAnswers.find(({ isCorrect }) => isCorrect === false)

  if (includesIncorrect) {
    return [0, 1];
  }
  return [1, 0];
}

const makePercentageChance = (percentageChance) => (
  Math.floor(Math.random() * (100 / percentageChance)) < 1
);

const checkRoundClue = (userGuesses) => async (guessedClue, index) => {
  const { guess } = userGuesses.find(({ word }) => guessedClue.childConcept === word);
  const isCorrect = parseInt(guess) === guessedClue.parentConceptId;

  await knex('game_clues')
    .where({ id: guessedClue.id })
    .update({
      show_answer: isCorrect || makePercentageChance(40),
      user_guessed_parent_concept_id: guess
    });

  const [updatedGuessedClue] = await knex('child_concepts')
    .join('game_clues', 'child_concepts.id', 'game_clues.child_concept_id')
    .where('game_clues.id', guessedClue.id);


  const formatClueWithoutOverride = formatClue(false);

  return formatClueWithoutOverride(updatedGuessedClue);
}

const gameShouldEnd = (correctGuessCount) => {
  return correctGuessCount >= 3;
}

const endGame = async (
  gameId
) => {
  await knex('games')
    .where({ id: gameId })
    .update({
      ended_at: moment(),
      current_round: 0
    });

  return;
}

const incrementGame = async (
  gameId,
  newCorrectGuessCount,
  newIncorrectGuessCount,
  currentRound,
) => {

  await knex('games')
    .where({ id: gameId })
    .update({
      incorrect_guess_count: newIncorrectGuessCount,
      correct_guess_count: newCorrectGuessCount,
      current_round: currentRound + 1,
    })

  return await knex('games')
    .where('id', gameId);
}

const checkAnswers = async (userGuesses, gameKey) => {
  const gameState = await getGameState(gameKey);

  const {
    currentRound,
    correctGuessCount,
    incorrectGuessCount,
    id: gameId,
  } = gameState;

  const roundClues = await getRoundCluesFromRound(currentRound, gameId, true);

  console.log(roundClues);

  const checkRoundClueWithGuesses = checkRoundClue(userGuesses);

  // This is what we're going to return
  const checkedRoundClues = await Promise.all(roundClues.map(checkRoundClueWithGuesses));

  const [addToCorrect, addToIncorrect] = incrementUserGuessCounts(checkedRoundClues);

  const newCorrectGuessCount = correctGuessCount + addToCorrect;
  const newIncorrectGuessCount = incorrectGuessCount + addToIncorrect;

  const [newGameState] = await incrementGame(gameId, newCorrectGuessCount, newIncorrectGuessCount, currentRound);

  if (gameShouldEnd(newCorrectGuessCount)) {
    await endGame(gameId, newCorrectGuessCount, newIncorrectGuessCount);

    return {
      hasGameEnded: true,
      roundClues: roundClues,
    }
  }

  await generateNewRound(newGameState);

  return {
    hasGameEnded: false,
    roundClues: checkedRoundClues
  };
}

module.exports = checkAnswers;
