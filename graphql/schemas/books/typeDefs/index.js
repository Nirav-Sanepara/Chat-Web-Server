// graphql/schemas/typeDefs.js
const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
    bookById(id: ID!): Book
    bookByTitle(title: String!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!): Book
  }
`;

export default typeDefs;
