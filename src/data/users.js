// This acts as our "in-memory database"
// In a real app, this would be a real database like MongoDB or PostgreSQL
const users = [
  {
    id: "user-001",
    name: "Alice Fernando",
    email: "alice@example.com",
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "user-002", 
    name: "Bob Perera",
    email: "bob@example.com",
    createdAt: "2026-01-02T00:00:00.000Z"
  }
];

module.exports = users;