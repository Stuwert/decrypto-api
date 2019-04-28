const { ApolloServer, gql } = require('apollo-server');
let getCompiledWords = require('./Words/compileWords');
let generateRandomizedClues = require('./GameState/initializeGame/generateRandomizedSequences');
let GameState = require('./GameState/index');
let knex = require('../knex');
let CurrentGame = new GameState();


const startGame = () => {
  if (CurrentGame.isFinished() || !CurrentGame.isStarted()) {
    return getCompiledWords().then((seedWords) => {
      // console.log("Seed Words are ", seedWords);
      return CurrentGame.startGame(seedWords);
    })
  }

  return CurrentGame.getGameState();
}

const getGameState = () => CurrentGame.getGameState();

const checkAnswers = (parent, args, context, info) => {
  return CurrentGame.checkAnswers(args["guesses"]);
}

const showAnswers = () => CurrentGame.showAnswers();

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
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
    showAnswer: Boolean!
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

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    getGameState: getGameState,
    showAnswers: showAnswers,
  },
  Mutation: {
    startGame: startGame,
    checkAnswers: checkAnswers,
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
