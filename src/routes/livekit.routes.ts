// src/routes/livekit.routes.ts
import { Router } from 'express';
import * as livekitController from '../controllers/livekit.controller';
import * as authMiddleware from '../middlewares/auth.middleware'; // Assuming middleware exists

const router = Router();

// Endpoint to generate a LiveKit token - requires authentication
// GET /api/v1/livekit/token?room=roomName
router.get('/token', authMiddleware.protect, livekitController.getToken);

export default router;
