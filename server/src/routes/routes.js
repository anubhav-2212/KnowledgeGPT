import { Router } from 'express';
import {
  createKnowledgeBase,
  getKnowledgeBases,
  getKnowledgeBaseById
} from '../controllers/kb.controller.js';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Authentication routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

// Knowledge Base routes (protected)
router.post('/knowledge-bases', auth, createKnowledgeBase);
router.get('/knowledge-bases', auth, getKnowledgeBases);
router.get('/knowledge-bases/:id', auth, getKnowledgeBaseById);

export default router;
