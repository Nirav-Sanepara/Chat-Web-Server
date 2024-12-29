import typeDefs from "./typeDefs/index.js";
import userQueries from "./resolvers/queries.js";
import userMutations from "./resolvers/mutations.js";

const resolvers = {
  Query: {
    ...userQueries,
  },
  Mutation: {
    ...userMutations,
  },
};

export { typeDefs, resolvers };
