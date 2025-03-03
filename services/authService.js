const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// In-memory user store for demonstration (replace with database in production)
const users = [];

exports.registerUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username, password: hashedPassword };
  users.push(user);
  return user;
};

exports.loginUser = async (username, password) => {
  const user = users.find(u => u.username === username);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });
  return token;
};
