const { ApolloServer, gql } = require('apollo-server');
let getCompiledWords = require('./Words/compileWords');
let generateRandomizedClues = require('./Utilities/randomizedClueSet');
let GameState = require('./GameState/index');
let CurrentGame = new GameState();


const startGame = () => {
  // This needs to be abstracted properly MERRRR
  return getCompiledWords().then((seedWords) => {
    return CurrentGame.startGame(seedWords);
  })
}

const getGameState = () => CurrentGame.getGameState();

const checkAnswers = (parent, args, context, info) => {
  return CurrentGame.checkAnswers(args["guesses"]);
}

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  type Word {
    word: String!
    isCorrect: Boolean
    guess: Int
  }

  type GameState {
    correctGuesses: Int
    currentRound: Int!
    currentRoundWords: [Word]
    incorrectGuesses: Int
    gameReady: Boolean!
    guessedWords: [Word]
  }

  input Guess {
    word: String!
    guess: Int!
  }

  type Query {
    getGameState: GameState
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
