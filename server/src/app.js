import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './utils/db.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "*"],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Main API routes
app.use('/api/v1/auth', authRoutes);

connectDB();

// Sample API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the Express backend!' });
});

export default app;
