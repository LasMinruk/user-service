const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser } = require('../controllers/userController');

// Define routes
router.get('/', getAllUsers);        // GET /users
router.get('/:id', getUserById);    // GET /users/user-001
router.post('/', createUser);       // POST /users

module.exports = router;