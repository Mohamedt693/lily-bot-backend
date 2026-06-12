import mongoose from 'mongoose';


const LinkOfferSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    storeName: { 
        type: String, 
        enum: ['Amazon', 'Noon', 'Sephora', 'Ulta', 'Jumia', 'AliExpress'], 
        required: true 
    },
    country: { 
        type: String, 
        enum: ['EG', 'SA', 'AE', 'US', 'GB', 'CA'],
        required: true 
    },
    affiliateUrl: { 
        type: String, 
        required: true 
    },
    coupons: [
        {
            code: String,
            expiryDate: Date,
            isActive: { type: Boolean, default: true }
        }
    ],
    currentPrice: { type: Number, default: 0 },
    lastPrice: { type: Number, default: 0 },
    currency: { 
        type: String, 
        enum: ['EGP', 'SAR', 'AED', 'USD', 'GBP', 'CAD'],
        required: true 
    },
    isAvailable: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
    lastError: String,
    shippingInfo: {
        isFree: { type: Boolean, default: false }, 
        cost: { type: Number, default: 0 },         
        provider: { type: String }                  
    },
});

LinkOfferSchema.index({ productId: 1, storeName: 1, country: 1 }, { unique: true });

export const LinkOffer = mongoose.model('LinkOffer', LinkOfferSchema);