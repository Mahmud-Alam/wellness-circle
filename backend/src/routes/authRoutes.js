import { Router } from 'express';
import { registerValidator, loginValidator } from '../validators.js';
import { validate } from '../middleware/errors.js';
import { requireAuth } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.get('/me', requireAuth, authController.me);

export default router;