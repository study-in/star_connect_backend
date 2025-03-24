import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/', userController.getUser);
router.post('/', userController.createUser);

export default router;
