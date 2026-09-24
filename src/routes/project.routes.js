import { Router } from 'express';
import {
  index, show, store, update, destroy, addMember, listMembers, removeMember,
} from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/projects', authenticate, index);
router.get('/projects/:id', authenticate, show);
router.post('/projects', authenticate, store);
router.put('/projects/:id', authenticate, update);
router.delete('/projects/:id', authenticate, destroy);

router.get('/projects/:id/members', authenticate, listMembers);
router.post('/projects/:id/members', authenticate, addMember);
router.delete('/projects/:id/members/:employeeId', authenticate, removeMember);

export default router;