import express from 'express';
import { 
    addLinkOffer, 
    getOffersByProductId, 
    updateLinkOffer, 
    deleteLinkOffer, 
    triggerPriceScraper 
} from '../controllers/linkOffer.controller.js'; 

const router = express.Router();

router.post('/', addLinkOffer);
router.get('/product/:productId', getOffersByProductId);
router.put('/:id', updateLinkOffer);
router.delete('/:id', deleteLinkOffer);
router.post('/trigger-scraper', triggerPriceScraper);

export default router;