import { Router } from 'express';
import {
  index, show, checkIn, checkOut, store, update, destroy,
} from '../controllers/attendance.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/attendances', authenticate, index);
router.get('/attendances/:id', authenticate, show);
router.post('/attendances/check-in', authenticate, checkIn);
router.patch('/attendances/:id/check-out', authenticate, checkOut);
router.post('/attendances', authenticate, store);       // input manual (admin)
router.put('/attendances/:id', authenticate, update);
router.delete('/attendances/:id', authenticate, destroy);

export default router;