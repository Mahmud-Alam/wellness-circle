import { Router } from 'express';
import { createEventValidator } from '../validators.js';
import { validate } from '../middleware/errors.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth.js';
import * as eventController from '../controllers/eventController.js';

const router = Router();

// Public
router.get('/', eventController.listEvents);
router.get('/:id', optionalAuth, eventController.getEvent);

// Admin only
router.post('/', requireAuth, requireAdmin, createEventValidator, validate, eventController.createEvent);
router.get('/:id/attendees', requireAuth, requireAdmin, eventController.listAttendees);

// User only (any authenticated user, but frontend shows only for role=user)
router.post('/:id/join', requireAuth, eventController.joinEvent);
router.delete('/:id/leave', requireAuth, eventController.leaveEvent);

export default router;