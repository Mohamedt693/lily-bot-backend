import express from 'express';
import { 
    addProduct, 
    getAllProducts, 
    getProductById, 
    getProductBySlug,
    updateProduct, 
    deleteProduct
} from '../controllers/product.controller.js';
// middleware
import { protectAdmin } from '../middlewares/auth.middleware.js';
import { detectCountry } from '../middlewares/country.middleware.js';

const router = express.Router();


router.get('/', getAllProducts); 
router.get('/slug/:slug', detectCountry, getProductBySlug); 
router.get('/:id', getProductById); 

router.post('/', protectAdmin, addProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;