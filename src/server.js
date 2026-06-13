import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
// middleware
import {responseHandler} from './middlewares/responseHandler.js';
// Routes
import consultationRoutes from './routes/consultation.routes.js';
import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/auth.routes.js';
import linkOfferRoutes from './routes/linkOffer.routes.js';
import priceHistoryRoutes from './routes/priceHistory.routes.js';
import subscriberRoutes from './routes/subscriber.routes.js';
import cronRoutes from './routes/cron.routes.js';

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
app.use('/api/cron', cronRoutes);
app.use('/api/auth', authRoutes);



const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});