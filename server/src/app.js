import express from 'express';
import cors from 'cors';
import apiRouter from './routes/routes.js';
import connectDB from './utils/db.js';

const app = express();

app.use(cors());
app.use(express.json());

// Main API routes
app.use('/api', apiRouter);
//
connectDB();

// Sample API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the Express backend!' });
});

export default app;
