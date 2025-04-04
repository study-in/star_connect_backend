// src/routes/user.routes.ts
import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import * as authMiddleware from '../middlewares/auth.middleware'; // Assuming middleware exists

const router = Router();

// --- Public Routes (if any related to users/experts) ---
// Example: Publicly view expert profile
router.get('/expert-profile/:expertUserId', userController.getPublicExpertProfile);


// --- Protected Routes (Require Login) ---
router.use(authMiddleware.protect);

router.get('/me', userController.getMe); // Get logged-in user's details
router.patch('/updateMe', userController.updateMe); // Update logged-in user's details
router.post('/apply-expert', userController.applyExpert); // Apply to become expert

// --- Admin Only Routes ---
// Mount admin routes separately or use restrictTo middleware
const adminRouter = Router(); // Create a sub-router for admin routes
adminRouter.use(authMiddleware.restrictTo('admin')); // Restrict ALL following routes to admin

adminRouter.get('/', /* userController.getAllUsers */ (req, res) => res.status(501).send('Not Implemented')); // Placeholder for get all users
adminRouter.get('/:id', userController.getUser); // Get specific user by ID
adminRouter.patch('/update-expert-status/:userId', userController.updateExpertApplication); // Approve/reject expert app
// adminRouter.delete('/:id', userController.deleteUser); // Delete a user

// Mount the admin sub-router under the main user router with a prefix (optional)
router.use('/admin', adminRouter);


export default router;
