const userService = require('../services/userService');

exports.getUser = (req, res) => {
  const userDetails = userService.getUserDetails();
  res.json({ message: 'User details retrieved successfully', user: userDetails });
};

exports.createUser = (req, res) => {
  const result = userService.createOrUpdateUser(req.body);
  res.json({ message: 'User created/updated successfully', result });
};
