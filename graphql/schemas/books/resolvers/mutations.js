const books = [
  { title: "The Awakening", author: "Kate Chopin" },
  { title: "City of Glass", author: "Paul Auster" },
];

const mutations = {
  addBook: (_, { title, author }) => {
    const newBook = { title, author };
    books.push(newBook);
    return newBook;
  },
};

export default mutations;
