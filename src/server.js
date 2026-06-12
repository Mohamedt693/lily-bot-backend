import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
// cron job
import cron from 'node-cron';
import { updatePrices } from './utils/jobs/scraper.js';
// middleware
import {responseHandler} from './middlewares/responseHandler.js';
// Routes
import consultationRoutes from './routes/consultation.routes.js';
import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/auth.routes.js';
import linkOfferRoutes from './routes/linkOffer.routes.js';
import priceHistoryRoutes from './routes/priceHistory.routes.js';
import subscriberRoutes from './routes/subscriber.routes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(responseHandler);

app.use('/api/products', productRoutes);        
app.use('/api/link-offers', linkOfferRoutes);   
app.use('/api/price-history', priceHistoryRoutes); 
app.use('/api', consultationRoutes);
app.use('/api/subscribe', subscriberRoutes);
app.use('/api/auth', authRoutes);

cron.schedule('0 4 */2 * *', async () => {
  console.log('⏰ Cron Job Triggered: Starting synchronization (Every 2 days)...');
  await updatePrices();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});