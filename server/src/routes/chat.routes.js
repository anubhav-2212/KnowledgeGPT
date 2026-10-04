import express from 'express';
import { chat, chatStream } from '../controllers/chat.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const chatRouter = express.Router();

chatRouter.post('/', auth, chat);
chatRouter.post('/stream', auth, chatStream);

export default chatRouter;