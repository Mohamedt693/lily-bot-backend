import express from 'express';
import { 
    addProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct
} from '../controllers/product.controller.js';
import { protectAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', protectAdmin, addProduct);
router.put('/products/:id', protectAdmin, updateProduct);
router.delete('/products/:id', protectAdmin, deleteProduct);

export default router;