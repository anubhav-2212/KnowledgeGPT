import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import { auth } from '../middleware/auth.middleware.js';
import {
  createTextSource,
  createWebsiteSource,
  uploadPdfSource,
  getSourcesByKnowledgeBase,
  deleteSource
} from '../controllers/source.controller.js';

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files to the uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Unique filename to avoid conflicts
  },
});

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit (adjust as needed)
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF files are allowed.'));
    }
  },
});

// Middleware to handle multer file upload and handle errors gracefully
const uploadSinglePdf = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}`,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};

const sourceRoutes = Router();

// Create source endpoints
sourceRoutes.post('/text', auth, createTextSource);
sourceRoutes.post('/website', auth, createWebsiteSource);
sourceRoutes.post('/pdf', auth, uploadSinglePdf, uploadPdfSource);

// Fetch sources for a knowledge base
sourceRoutes.get('/kb/:knowledgeBaseId', auth, getSourcesByKnowledgeBase);

// Delete source
sourceRoutes.delete('/:sourceId', auth, deleteSource);

export default sourceRoutes;
