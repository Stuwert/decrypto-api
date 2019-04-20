let createWordCluesForRound = require('./createRound');
let generateRandomizedSequences = require('../Utilities/randomizedClueSet');

// Game State cares about holding the overall state details
// It explicitly manages current round, correct guesses, incorrect guesses, current round clues, and previous guesses
//

const incrementedCounts = (checkedAnswers) => {
  const includesIncorrect = checkedAnswers.find(({ isCorrect }) => isCorrect === false)

  if (includesIncorrect) {
    return [0, 1];
  }
  return [1, 0];
}

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

const seedToMapping = (
  map,
  {
    parentWord,
    relatedWords,
    parentWordNumber
  }) => {
  map.set(parentWordNumber, {
    relatedWords,
    parentWord
  });
  return map;
};

class GameState {
  constructor() {
    this.currentRound = 1;
    this.correctGuesses = 0;
    this.incorrectGuesses = 0;
    this.currentRoundWords = [];
    this.guessedWords = [];
    this.gameReady = false;
    this.clueSequences = generateRandomizedSequences();
  }

  getGameState() {
    this.checkGameReady();

    return {
      currentRound: this.currentRound,
      correctGuesses: this.correctGuesses,
      incorrectGuesses: this.incorrectGuesses,
      guessedWords: this.guessedWords,
      currentRoundWords: this.currentRoundWords,
      gameReady: this.gameReady,
    }
  }

  checkGameReady() {
    if (!this.gameReady) {
      throw new Error('The Game State Has Not Been Initialized');
    }
  }

  startGame(seedWords) {
    if (this.gameReady) {
      throw new Error('You cannot start the game twice');
    }
    this.seedWords = seedWords.reduce(seedToMapping, new Map())
    this.gameReady = true;
    this.currentRoundWords = this.generateRoundClues();

    console.log(this.getGameState());
    return this.getGameState();
  }

  getRoundClues() {
    this.checkGameReady();

    return this.currentRoundWords;
  }

  generateRoundClues() {
    this.checkGameReady();

    const roundSequence = this.clueSequences.pop();

    const generateRoundClue = this.generateRoundClue.bind(this);
    this.currentRoundWords = roundSequence.map(generateRoundClue);

    return this.currentRoundWords;
  }

  generateRoundClue(parentWordNumber) {
    const word = this.popWordFromSeedWords(parentWordNumber);

    return {
      word,
      answer: parentWordNumber,
      isCorrect: null,
    }
  }

  popWordFromSeedWords(parentWordNumber) {
    const relatedWords = this.seedWords.get(parentWordNumber).relatedWords;
    const indexToGet = Math.floor(Math.random() * relatedWords.size);
    const word = Array.from(relatedWords)[indexToGet];

    relatedWords.delete(word);

    return word;
  }

  checkAnswers(userGuesses) {
    this.checkGameReady();

    if (userGuesses.length !== this.currentRoundWords.length) {
      throw new Error("You must make exactly 3 guesses");
    }

    const currentRoundWords = this.currentRoundWords;

    // This could technically lead to them being re-ordered...
    const answeredWords = userGuesses.map(
      (guessWord, wordIndex) => ({
        ...currentRoundWords[wordIndex],
        isCorrect: compareGuessToAnswer(currentRoundWords, guessWord),
        guess: guessWord.guess,
      })
    )

    const [addToCorrect, addToIncorrect] = incrementedCounts(answeredWords);
    console.log(addToCorrect);
    console.log(addToIncorrect);
    console.log(this.correctGuesses);
    this.correctGuesses = this.correctGuesses + addToCorrect;
    this.incorrectGuesses = this.incorrectGuesses + addToIncorrect;
    this.guessedWords = this.guessedWords.concat(answeredWords);
    this.currentRound++;
    console.log(this.getGameState());

    this.generateRoundClues();

    return answeredWords;
  }
}

module.exports = GameState;

// let gameState = {};

// const incrementCounts = (checkedAnswers) => {
//   const { correctGuesses, incorrectGuesses } = gameState;
//   const includesIncorrect = checkedAnswers.find(({ correct }) => correct === false)

//   if (includesIncorrect) {
//     return [correctGuesses, incorrectGuesses + 1];
//   }
//   return [correctGuesses + 1, incorrectGuesses];
// }

// const startNewGame = () => {

//   getCompiledWords().then((results) => {

//     roundDetails.words = results;
//     generateRound();
//     return true;
//   });
//   gameState = {
//     currentRound: 1,
//     correctGuesses: 0,
//     incorrectGuesses: 0,
//     currentRoundWords: createWordCluesForRound(),
//     guessedWords: [],
//     rootWords: reuslts,
//   }

//   return gameState;
// };

// const getGameState = () => gameState;

// const setGuessedWords = (currentRoundWords) => {
//   const { guessedWords } = gameState;

//   const guessedAndCurrentWords = guessedWords.concat(currentRoundWords);
//   const [correctGuesses, incorrectGuesses] = incrementCounts(currentRoundWords);

//   gameState = {
//     ...gameState,
//     guessedWords: guessedAndCurrentWords,
//     correctGuesses,
//     incorrectGuesses,
//   }
// }

// const createNewRound = () => {
//   const { currentRound } = gameState;
//   gameState = {
//     ...gameState,
//     currentRound: currentRound + 1,
//     currentRoundWords: createWordCluesForRound()
//   }
// };

// const compareGuessToAnswer = ({ word: guessWord, guess }) => {
//   const { currentRoundWords } = gameState;
//   const { answer } = currentRoundWords.find(({ word }) => word === guessWord);

//   return answer === guess;
// };


// const makeGuess = (guessedWords) => {
//   const { currentRoundWords } = gameState;
//   if (currentRoundWords.length !== guessedWords.length) {
//     throw new Error('this is an incorrect submission');
//   }

//   const checkedGuessWords = guessedWords.map((guessWord) => ({
//     ...guessWord,
//     isCorrect: compareGuessToAnswer(guessWord)
//   }));

//   setGuessedWords(checkedGuessWords);
//   createNewRound();

//   return checkedGuessWords
// };

// export {
//   startNewGame,
//   makeGuess,
//   getGameState,
// };
