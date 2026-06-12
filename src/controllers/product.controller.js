import { Product } from '../models/product.model.js';
import { LinkOffer } from '../models/linkOffer.model.js';
import PRODUCT_MESSAGES from '../utils/messages/product.messages.js';

export const addProduct = async (req, res) => {
    try {
        const { name, description, category, budget, skinType, origin, images } = req.body;

        if (!name || !description || !category || !budget || !skinType || !origin || !images || images.length === 0) {
            return res.error(PRODUCT_MESSAGES.ERROR.REQUIRED_FIELDS, 400);
        }

        if (!['economy', 'medium', 'luxury'].includes(budget)) {
            return res.error(PRODUCT_MESSAGES.ERROR.INVALID_BUDGET, 400);
        }

        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        
        return res.success(PRODUCT_MESSAGES.SUCCESS.CREATED, savedProduct, 201);
    } catch (error) {
        return res.error(PRODUCT_MESSAGES.ERROR.SERVER_ERROR, 500, error);
    }
};


export const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const userCountry = req.userCountry || 'EG';

        const product = await Product.findOne({ slug });
        if (!product) {
            return res.error(PRODUCT_MESSAGES.ERROR.NOT_FOUND, 404);
        }

        const offers = await LinkOffer.find({ 
            productId: product._id, 
            country: userCountry 
        }).sort({ currentPrice: 1 });

        return res.success("Product and offers fetched successfully.", {
            product,
            offers
        }, 200);

    } catch (error) {
        return res.error(PRODUCT_MESSAGES.ERROR.SERVER_ERROR, 500, error);
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.error(PRODUCT_MESSAGES.ERROR.NOT_FOUND, 404);
        }
        
        return res.success(PRODUCT_MESSAGES.SUCCESS.FETCHED_ONE, product, 200);
    } catch (error) {
        return res.error(PRODUCT_MESSAGES.ERROR.SERVER_ERROR, 500, error);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.error(PRODUCT_MESSAGES.ERROR.NOT_FOUND, 404);
        }
        
        return res.success(PRODUCT_MESSAGES.SUCCESS.UPDATED, updatedProduct, 200);
    } catch (error) {
        return res.error(PRODUCT_MESSAGES.ERROR.SERVER_ERROR, 500, error);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.error(PRODUCT_MESSAGES.ERROR.NOT_FOUND, 404);
        }
        return res.success(PRODUCT_MESSAGES.SUCCESS.DELETED, null, 200);
    } catch (error) {
        return res.error(PRODUCT_MESSAGES.ERROR.SERVER_ERROR, 500, error);
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { category, skinType, budget } = req.query;

        let filterQuery = {};
        if (category) filterQuery.category = category;
        if (skinType) filterQuery.skinType = skinType;
        if (budget) filterQuery.budget = budget;

        const totalProducts = await Product.countDocuments(filterQuery);
        const products = await Product.find(filterQuery)
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalProducts / limit);

        return res.success("Products fetched successfully.", {
            products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: page,
                limit
            }
        });

    } catch (error) {
        console.error("Get All Products Error:", error);
        return res.error("Failed to fetch products.", 500, error);
    }
};