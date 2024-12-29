const users = [];

const mutations = {
  addUser: (_, { name, email }) => {
    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    return newUser;
  },
};

export default mutations;
