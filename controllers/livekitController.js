const livekitService = require('../services/livekitService');

exports.getToken = (req, res) => {
  const room = req.query.room;
  const identity = req.query.identity;
  if (!room || !identity) {
    return res.status(400).json({ message: 'Room and identity are required' });
  }
  try {
    const token = livekitService.generateToken(room, identity);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error generating token', error: error.message });
  }
};
