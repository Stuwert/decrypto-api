const { gql } = require('apollo-server');

module.exports = gql`

  type GameState {
    correctGuessCount: Int!
    currentRound: Int!
    startedAt: String
    endedAt: String
    key: ID!
    incorrectGuessCount: Int!
    otherRoundClues: [GameClue]
    currentRoundClues: [GameClue]
    parentConcepts: [ID]!
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

  type RoundAnswers {
    roundClues: [GameClue]
    hasGameEnded: Boolean
  }

  input Guess {
    word: String!
    guess: Int!
  }

  type Query {
    getGameState(key: ID!): GameState
    showFinalGameState(key: ID!): FinalGameState
  }

  type Mutation {
    startGame: ID!
    checkAnswers(
      gameKey: ID!
      guesses: [Guess]!
    ): RoundAnswers
  }
`;
