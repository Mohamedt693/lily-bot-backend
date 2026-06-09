import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import {responseHandler} from '../src/middlewares/responseHandler.js';
import consultationRoutes from './routes/consultation.routes.js';
import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(responseHandler);

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', productRoutes);
app.use('/api', consultationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});