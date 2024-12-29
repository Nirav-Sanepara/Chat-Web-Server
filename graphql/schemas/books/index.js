import typeDefs from "./typeDefs/index.js";
import bookQueries from "./resolvers/queries.js";
import bookMutations from "./resolvers/mutations.js";

const resolvers = {
  Query: {
    ...bookQueries,
  },
  Mutation: {
    ...bookMutations,
  },
};

export { typeDefs, resolvers };
