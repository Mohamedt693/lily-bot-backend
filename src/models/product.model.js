import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    budget: { type: String, enum: ['economy', 'medium', 'luxury'], required: true },
    skinType: [{ type: String, required: true }],
    origin: { type: String, required: true },
    images: [{ type: String, required: true }],
    ingredients: [{ type: String, trim: true }]
}, { timestamps: true });

productSchema.pre('findOneAndDelete', async function(next) {
    const productId = this.getQuery()._id;
    const LinkOffer = mongoose.model('LinkOffer');
    const PriceHistory = mongoose.model('PriceHistory');
    
    const offers = await LinkOffer.find({ productId });
    const offerIds = offers.map(o => o._id);
    
    await PriceHistory.deleteMany({ offerId: { $in: offerIds } });
    await LinkOffer.deleteMany({ productId });
    next();
});

export const Product = mongoose.model('Product', productSchema);