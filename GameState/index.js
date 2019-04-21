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

const getParentWords = (seedWords) => {
  return [1, 2, 3, 4, 5].map((index) => ({
    parentOf: index,
    word: seedWords.get(index).parentWord,
  }))
}

const pickAnswerToShow = (guessedWord, index, checkedAnswers) => {
  const { isCorrect } = guessedWord;

  if (isCorrect) return guessedWord;

  // We will allow users to see 1 fewer answers than the number of incorrect guesses
  // i.e. if they have 3 incorrect guesses they will see 2 answers.
  // If no answers are incorrect, the code will never reach here.
  const incorrectWordsToShowAnswer = checkedAnswers.filter(({ isCorrect }) => !isCorrect).slice(0, -1);

  if (incorrectWordsToShowAnswer.indexOf(guessedWord) !== -1) {
    return guessedWord;
  }

  const removeAnswerFromGuess = ({ answer, ...rest }) => ({ ...rest });

  return removeAnswerFromGuess(guessedWord);
}

class GameState {
  constructor() {
    this.currentRound = 1;
    this.correctGuesses = 0;
    this.incorrectGuesses = 0;
    this.currentRoundWords = [];
    this.guessedWords = [];
    this.gameReady = false;
    this.clueSequences = generateRandomizedSequences();
    this.gameComplete = false;
  }

  showAnswers() {
    if (this.correctGuesses < 3) {
      return this.getGameState();
    }

    return {
      ...this.getGameState(),
      answers: getParentWords(this.seedWords),
    }
  }

  isFinished() {
    return this.isFinished;
  }

  isStarted() {
    return this.gameReady;
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
    // if (this.gameReady) {
    //   throw new Error('You cannot start the game twice');
    // }
    this.seedWords = seedWords.reduce(seedToMapping, new Map())
    this.gameReady = true;
    this.currentRoundWords = this.generateRoundClues();
    this.gameFinished = false;

    console.log(this.seedWords);


    return this.getGameState();
  }

  getRoundClues() {
    this.checkGameReady();

    return this.currentRoundWords;
  }

  generateRoundClues() {
    console.group('Genereate Round Clue Sequence')
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
    const roundNumber = this.currentRound;

    // This could technically lead to them being re-ordered...
    const answeredWords = userGuesses.map(
      (guessWord, wordIndex) => ({
        ...currentRoundWords[wordIndex],
        isCorrect: compareGuessToAnswer(currentRoundWords, guessWord),
        guess: guessWord.guess,
        locationInSequence: wordIndex + 1,
        roundNumber,
      })
    );

    const answeredWordsWithAnswers = answeredWords.map(pickAnswerToShow);

    const [addToCorrect, addToIncorrect] = incrementedCounts(answeredWords);

    this.correctGuesses = this.correctGuesses + addToCorrect;
    this.incorrectGuesses = this.incorrectGuesses + addToIncorrect;
    this.guessedWords = this.guessedWords.concat(answeredWordsWithAnswers);
    this.currentRound++;

    if (this.correctGuesses >= 3) {
      this.isFinished = true;
    }

    this.generateRoundClues();

    return answeredWordsWithAnswers;
  }
}

module.exports = GameState;
