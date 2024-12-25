import { GraphQLSchema, GraphQLObjectType } from "graphql";
import * as ProductQueries from "../queries/ProductQueries.js";
import * as OrderQueries from "../queries/OrderQueries.js";
import { createProduct, updateProduct } from "../mutations/productMutations.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...ProductQueries,
    ...OrderQueries,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createProduct,
    updateProduct,
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
