import { Router } from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth.middleware.js';
import {
  createTextSource,
  createWebsiteSource,
  uploadPdfSource,
  getSourcesByKnowledgeBase,
  deleteSource
} from '../controllers/source.controller.js';

const upload = multer({ storage: multer.memoryStorage() });
const sourceRoutes = Router();

// Create source endpoints
sourceRoutes.post('/text', auth, createTextSource);
sourceRoutes.post('/website', auth, createWebsiteSource);
sourceRoutes.post('/pdf', auth, upload.single('file'), uploadPdfSource);

// Fetch sources for a knowledge base
sourceRoutes.get('/kb/:knowledgeBaseId', auth, getSourcesByKnowledgeBase);

// Delete source
sourceRoutes.delete('/:sourceId', auth, deleteSource);

export default sourceRoutes;
