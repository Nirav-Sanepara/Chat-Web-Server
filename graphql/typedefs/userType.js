import { graphql } from "graphql";
const { GraphQLObjectType, GraphQLString } = graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    isAdmin: { type: graphql.GraphQLBoolean },
  }),
});

export default UserType;
