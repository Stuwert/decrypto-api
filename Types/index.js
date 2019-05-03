const { gql } = require('apollo-server');

module.exports = gql`

  type GameState {
    correctGuessCount: Int!
    currentRound: Int!
    startedAt: String
    endedAt: String
    id: ID!
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
    getGameState(id: ID!): GameState
    showFinalGameState(game: ID!): FinalGameState
  }

  type Mutation {
    startGame: ID!
    checkAnswers(
      gameId: ID!
      guesses: [Guess]!
    ): RoundAnswers
  }
`;
