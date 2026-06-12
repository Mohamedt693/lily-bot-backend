import mongoose from 'mongoose';

const PriceHistorySchema = new mongoose.Schema({
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'LinkOffer', required: true },
    price: { type: Number, required: true },
    checkedAt: { type: Date, default: Date.now }
});

PriceHistorySchema.index({ offerId: 1, checkedAt: -1 });

export const PriceHistory = mongoose.model('PriceHistory', PriceHistorySchema);