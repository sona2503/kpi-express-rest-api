import { Router } from 'express';
import { index, show, store, update, destroy } from '../controllers/employee.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/employees', authenticate, index);
router.get('/employees/:id', authenticate, show);
router.post('/employees', authenticate, store);
router.put('/employees/:id', authenticate, update);
router.delete('/employees/:id', authenticate, destroy);

export default router;