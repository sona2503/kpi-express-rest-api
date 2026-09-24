import { Router } from 'express';
import { index, show, store, update, start, complete, destroy } from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/tasks', authenticate, index);
router.get('/tasks/:id', authenticate, show);
router.post('/tasks', authenticate, store);
router.put('/tasks/:id', authenticate, update);
router.patch('/tasks/:id/start', authenticate, start);
router.patch('/tasks/:id/complete', authenticate, complete);
router.delete('/tasks/:id', authenticate, destroy);

export default router;