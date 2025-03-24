import { Router } from 'express';
import * as livekitController from '../controllers/livekitController';
import authenticateToken from '../middlewares/auth';

const router = Router();

// Endpoint to generate a LiveKit token
// Example: GET /livekit/token?room=demo-room&identity=anonymous
router.get('/token', authenticateToken, livekitController.getToken);

export default router;
