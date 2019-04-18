const { ApolloServer, gql } = require('apollo-server');
let getCompiledWords = require('./compileWords');
let generateRandomizedClues = require('./randomizedClueSet');

const roundDetails = {
  clues: [],
};

const generateRoundClue = (clueAnswer) => {
  // Find Parent Word + Set
  // Get Random Word from set and remove it
  // set details and  return  correct object

  console.log("Clue answer is ", clueAnswer);
  // console.log(roundDetails.words);
  const { relatedWords } = roundDetails.words.find(({ parentWordNumber }) => parentWordNumber === clueAnswer);

  // pick the word from the set

  const indexToGet = Math.floor(Math.random() * relatedWords.size);

  // console.log(indexToGet);

  const word = Array.from(relatedWords)[indexToGet];
  // console.log(relatedWords.entries());
  console.log("Word is, ", word);
  relatedWords.delete(word);
  console.log(relatedWords.has(word));

  return {
    word,
    correct: clueAnswer,
    guess: null,
  }
}



const generateRound = () => {
  const indexOfRound = roundDetails.currentRound - 1;

  const roundSequence = roundDetails.sequences[indexOfRound];

  const wordClues = roundSequence.map(generateRoundClue);
  roundDetails.clues.push(wordClues);
}

const startGame = () => {

  // generates the list of random clues
  roundDetails.sequences = generateRandomizedClues();
  roundDetails.currentRound = 1;


  // makes the api request to get the word relationships
  // stores them to a global object that can be accessed easily
  return getCompiledWords().then((results) => {

    roundDetails.words = results;
    generateRound();
    return true;
  });
  // .catch((error) => {
  //   console.log(error);
  //   return false;
  // });
}

const getRoundClues = () => {
  return roundDetails.clues[roundDetails.currentRound - 1];
}

const checkAnswers = (parent, args, context, info) => {
  if (args['guesses'].length !== 3) {
    throw new Error("You must make exactly 3 guesses");
  }
  const roundIndex = roundDetails.currentRound - 1;

  roundDetails.clues[roundIndex] = args['guesses'].map(
    (guess, wordIndex) => ({
      ...roundDetails.clues[roundIndex][wordIndex],
      isCorrect: roundDetails.clues[roundIndex][wordIndex].correct === guess.guess,
      guess: guess.guess,
    })
  )
  console.log(roundDetails.clues[roundIndex]);
  roundDetails.currentRound++;
  generateRound();
  return roundDetails.clues[roundIndex];
}

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  type RoundClue {
    word: String!
    isCorrect: Boolean
    guess: Int
  }

  input Guess {
    word: String!
    guess: Int!
  }

  type Query {
    roundDetails: Int
    getRoundClues: [RoundClue]
  }

  type Mutation {
    startGame: Boolean
    checkAnswers(
      guesses: [Guess]
    ): [RoundClue]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    roundDetails: () => 1,
    getRoundClues: getRoundClues,
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
