const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: `User with ID ${req.params.id} not found` });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ success: false, message: `User with ID ${req.params.id} not found` });
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and email'
      });
    }

    // ✅ Sanitize: explicitly cast to string to prevent NoSQL injection
    const sanitizedEmail = String(email).toLowerCase().trim();
    const sanitizedName = String(name).trim();

    const existing = await User.findOne({ email: sanitizedEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const user = await User.create({ name: sanitizedName, email: sanitizedEmail });
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, createUser };