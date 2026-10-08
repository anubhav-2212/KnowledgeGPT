import express, { Router } from 'express';
import { registerUser, loginUser, logoutUser, getMe, getProfile, googleAuth } from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const authRoutes=Router();

//register user
authRoutes.post('/register',registerUser)

//login user
authRoutes.post('/login',loginUser)

//google login
authRoutes.post('/google', googleAuth);

//logout user
authRoutes.post('/logout',logoutUser)

//get current logged in user
authRoutes.get('/me',auth,getMe)

//get profile
authRoutes.get('/profile',auth,getProfile)


export default authRoutes;
