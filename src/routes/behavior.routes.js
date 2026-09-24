import { Router } from 'express';
import { index, show, store, update, destroy, average } from '../controllers/behavior.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/behaviors', authenticate, index);
router.get('/behaviors/:id', authenticate, show);
router.post('/behaviors', authenticate, store);
router.put('/behaviors/:id', authenticate, update);
router.delete('/behaviors/:id', authenticate, destroy);
router.get('/employees/:employeeId/behaviors/average', authenticate, average);

export default router;