import { Router } from 'express';
import { auth } from '../middleware/auth.middleware.js';
import {
  createKnowledgeBase,
  getKnowledgeBases,
  getKnowledgeBaseById
} from '../controllers/kb.controller.js';

const kbRoutes = Router();

// Knowledge Base routes (protected)
kbRoutes.post('/', auth, createKnowledgeBase);
kbRoutes.get('/', auth, getKnowledgeBases);
kbRoutes.get('/:id', auth, getKnowledgeBaseById);

export default kbRoutes;