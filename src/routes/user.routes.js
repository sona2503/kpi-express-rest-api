// src/routes/user.routes.js
import { Router } from 'express';
import { store, destroy, login, logout } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/login', login);
router.post('/logout', authenticate, logout);

router.post('/users', store);
router.delete('/users/:id', destroy);

export default router;