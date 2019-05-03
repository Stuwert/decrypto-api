const { gql } = require('apollo-server');

module.exports = gql`

  type GameState {
    correctGuessCount: Int!
    currentRound: Int!
    createdAt: String
    endedAt: String
    id: ID!
    incorrectGuessCount: Int!
    updatedAt: String
    gameClues: [GameClue]
    currentRoundWords: [GameClue]
  }

  type FinalGameState {
    game: GameState
    gameAnswers: [GameAnswer]
  }

  type GameAnswer {
    parentConcept: String!
    parentConceptId: ID!
  }

  type GameClue {
    childConcept: String!
    sequenceLocation: Int!
    gameRound: Int!
    userGuessedParentConceptId: ID
    parentConceptId: ID
    isCorrect: Boolean
  }

  input Guess {
    word: String!
    parentConceptId: Int!
  }

  type Query {
    getGameState(game: ID!): GameState
    showFinalGameState(game: ID!): FinalGameState
  }

  type Mutation {
    startGame: ID!
    checkAnswers(
      guesses: [Guess]
    ): [GameClue]
  }
`;
