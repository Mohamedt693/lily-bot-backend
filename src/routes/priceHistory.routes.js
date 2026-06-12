import express from 'express';
import { getPriceHistory } from '../controllers/priceHistory.controller.js';

const router = express.Router();

router.get('/:offerId', getPriceHistory);

export default router;