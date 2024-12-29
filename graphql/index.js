import { mergeTypeDefs } from "@graphql-tools/merge";
import { mergeResolvers } from "@graphql-tools/merge";
import {
  typeDefs as bookTypeDefs,
  resolvers as bookResolvers,
} from "./schemas/books/index.js";
import {
  typeDefs as userTypeDefs,
  resolvers as userResolvers,
} from "./schemas/users/index.js";
import {
  typeDefs as productTypeDefs,
  resolvers as productResolvers,
} from "./schemas/product/index.js";

const typeDefs = mergeTypeDefs([bookTypeDefs, userTypeDefs, productTypeDefs]);
const resolvers = mergeResolvers([
  bookResolvers,
  userResolvers,
  productResolvers,
]);

export { typeDefs, resolvers };
