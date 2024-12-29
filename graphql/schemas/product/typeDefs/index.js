const typeDefs = `#graphql
  type Product {
    id: ID!
    title: String!
    description: String!
    price: Float!
    discountPercentage: Float!
    rating: Float!
    stock: Int!
    brand: String!
    category: String!
    thumbnail: String!
    images: String!
  }

  input ProductInput {
    title: String!
    description: String!
    price: Float!
    discountPercentage: Float!
    rating: Float!
    stock: Int!
    brand: String!
    category: String!
    thumbnail: String!
    images: String!
  }

  type Query {
    getProduct(id: ID!): Product
    getProducts: [Product!]!
  }

  type Mutation {
    addProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Boolean
  }
`;

export default typeDefs;
