const express = require('express');
const router = express.Router();
const livekitController = require('../controllers/livekitController');

// Endpoint to generate a LiveKit token
// Example: GET /livekit/token?room=demo-room&identity=anonymous
router.get('/token', livekitController.getToken);

module.exports = router;
