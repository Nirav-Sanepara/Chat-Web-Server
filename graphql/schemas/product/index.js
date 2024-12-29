import typeDefs from "./typeDefs/index.js";
import productQueries from "./resolvers/queries.js";
import productMutations from "./resolvers/mutations.js";

const resolvers = {
  Query: {
    ...productQueries,
  },
  Mutation: {
    ...productMutations,
  },
};

export { typeDefs, resolvers };
