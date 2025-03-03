const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    await authService.registerUser(username, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authService.loginUser(username, password);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
