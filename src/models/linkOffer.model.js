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
        enum: ['EG', 'KSA', 'UAE', 'US'], 
        required: true
    },
    url: {
        type: String,
        required: true
    },
    priceSelector: {
        type: String, 
        required: true
    },
    currentPrice: {
        type: Number, 
        default: 0
    },
    lastPrice: {
        type: Number, 
        default: 0
    },
    currency: {
        type: String, 
        enum: ['EGP', 'SAR', 'AED', 'USD'], 
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export const LinkOffer = mongoose.model('LinkOffer', LinkOfferSchema);