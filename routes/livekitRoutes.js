const express = require('express');
const router = express.Router();
const livekitController = require('../controllers/livekitController');
const authenticateToken = require('../middlewares/auth');

// Endpoint to generate a LiveKit token
// Example: GET /livekit/token?room=demo-room&identity=anonymous
// router.get('/token', authenticateToken, livekitController.getToken);
router.get('/token', livekitController.getToken);

module.exports = router;
