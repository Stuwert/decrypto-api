const { ApolloServer, } = require('apollo-server');
const typeDefs = require('./Types');
const Query = require('./Query');
const Mutation = require('./Mutation');

const resolvers = {
  Query,
  Mutation,
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
