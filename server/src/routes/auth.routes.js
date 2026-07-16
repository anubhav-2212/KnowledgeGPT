import express, { Router } from 'express';
import { registerUser, loginUser,logoutUser, getMe } from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const authRoutes=Router();

//register user
authRoutes.post('/register',registerUser)

//login user
authRoutes.post('/login',loginUser)

//logout user
authRoutes.post('/logout',logoutUser)

//get current logged in user
authRoutes.get('/me',auth,getMe)


export default authRoutes;
