// Mock database for testing mutations and queries

const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    age: 25,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    age: 30,
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    age: 22,
  },
];

const mockDatabase = {
  getUsers: () => users,
  getUserById: (id) => users.find((user) => user.id === id),
  addUser: (user) => {
    const newUser = { id: String(users.length + 1), ...user };
    users.push(newUser);
    return newUser;
  },
  updateUser: (id, updatedFields) => {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) return null;
    users[userIndex] = { ...users[userIndex], ...updatedFields };
    return users[userIndex];
  },
  deleteUser: (id) => {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) return null;
    const deletedUser = users.splice(userIndex, 1);
    return deletedUser[0];
  },
};

module.exports = mockDatabase;