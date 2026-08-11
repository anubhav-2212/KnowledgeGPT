import express from 'express';
const chatRouter=express.Router();
import { chat } from '../controllers/chat.controller.js';
import { auth } from '../middleware/auth.middleware.js';


chatRouter.post('/',auth,chat)

export default chatRouter