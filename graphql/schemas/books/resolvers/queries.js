const books = [
  { title: "The Awakening", author: "Kate Chopin" },
  { title: "City of Glass", author: "Paul Auster" },
];

const queries = {
  books: () => books,
  bookById: (_, { id }) => books.find((book) => book.id === id),
  bookByTitle: (_, { title }) => books.find((book) => book.title === title),
};

export default queries;
