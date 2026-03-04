const { v4: uuidv4 } = require('uuid');
const users = require('../data/users');

// GET /users - Returns all users
const getAllUsers = (req, res) => {
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
};

// GET /users/:id - Returns a single user by ID
const getUserById = (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User with ID ${req.params.id} not found`
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
};

// POST /users - Creates a new user
const createUser = (req, res) => {
  const { name, email } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name and email'
    });
  }

  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  const newUser = {
    id: `user-${uuidv4().split('-')[0]}`,
    name,
    email,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
};

module.exports = { getAllUsers, getUserById, createUser };