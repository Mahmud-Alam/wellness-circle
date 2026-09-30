import { Router } from 'express';
import { updateProfileValidator } from '../validators.js';
import { validate } from '../middleware/errors.js';
import { requireAuth } from '../middleware/auth.js';
import * as profileController from '../controllers/profileController.js';

const router = Router();

router.get('/', requireAuth, profileController.getMyProfile);
router.put('/', requireAuth, updateProfileValidator, validate, profileController.updateMyProfile);

export default router;