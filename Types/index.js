const { gql } = require('apollo-server');

module.exports = gql`
  type WordClue {
    word: String!
    isCorrect: Boolean
    locationInSequence: Int
  }

  type WordAnswer {
    word: String!
    parentOf: Int!
  }

  type Word {
    word: String!
    isCorrect: Boolean
    guess: Int
    locationInSequence: Int
    roundNumber: Int
    answer: Int
  }

  type GameState {
    correctGuesses: Int
    currentRound: Int!
    currentRoundWords: [WordClue]
    incorrectGuesses: Int
    gameReady: Boolean!
    guessedWords: [Word]
    answers: [WordAnswer]
  }

  input Guess {
    word: String!
    guess: Int!
  }

  type Query {
    getGameState: GameState
    showAnswers: GameState
  }

  type Mutation {
    startGame: GameState
    checkAnswers(
      guesses: [Guess]
    ): [Word]
  }
`;
