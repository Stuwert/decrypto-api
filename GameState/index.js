// Game State cares about holding the overall state details
// It explicitly manages current round, correct guesses, incorrect guesses, current round clues, and previous guesses
//






class GameState {
  constructor() {
    this.currentRound = 1;
    this.correctGuesses = 0;
    this.incorrectGuesses = 0;
    this.currentRoundWords = [];
    this.guessedWords = [];
    this.gameComplete = false;
    this.gameReady = false;
    this.clueSequences = generateRandomizedSequences();
    this.hasBeenCompleted = false;
  }

  getGuessedWords(showAnswers = false) {
    if (showAnswers) return this.guessedWords;

    const removeAnswerFromGuess = ({ answer, ...rest }) => ({ ...rest });

    return this.guessedWords.map((word) => {
      if (word.showAnswer) return word;
      return removeAnswerFromGuess(word);
    })
  }


  showAnswers() {
    if (this.correctGuesses < 3) {
      return this.getGameState();
    }

    const showAnswers = true;

    return {
      ...this.getGameState(showAnswers),
      answers: getParentWords(this.seedWords),
    }
  }

  isFinished() {
    return this.hasBeenCompleted;
  }

  isStarted() {
    return this.gameReady;
  }

  // Passing false is a hacky-hack. Different views should be
  // accessed through different methods, ieally.
  getGameState(showAnswers = false) {
    this.checkGameReady();

    return {
      currentRound: this.currentRound,
      correctGuesses: this.correctGuesses,
      incorrectGuesses: this.incorrectGuesses,
      guessedWords: this.getGuessedWords(showAnswers),
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
    this.seedWords = seedWords.reduce(seedToMapping, new Map())
    this.gameReady = true;
    this.currentRoundWords = this.generateRoundClues();
    this.gameFinished = false;
    this.currentRound = 1;
    this.correctGuesses = 0;
    this.incorrectGuesses = 0;
    this.guessedWords = [];

    return this.getGameState();
  }

  getRoundClues() {
    this.checkGameReady();

    return this.currentRoundWords;
  }


  popWordFromSeedWords(parentWordNumber) {
    const relatedWords = this.seedWords.get(parentWordNumber).relatedWords;
    const indexToGet = Math.floor(Math.random() * relatedWords.size);
    const word = Array.from(relatedWords)[indexToGet];

    relatedWords.delete(word);

    return word;
  }


}

module.exports = GameState;
