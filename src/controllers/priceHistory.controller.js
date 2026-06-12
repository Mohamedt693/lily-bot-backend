import { PriceHistory } from "../models/priceHistory.model.js";
import { LinkOffer } from "../models/linkOffer.model.js";

export const getPriceHistory = async (req, res) => {
    try {
        const { offerId } = req.params;

        const offer = await LinkOffer.findById(offerId);
        if (!offer) {
            return res.error("Offer not found", 404);
        }

        const history = await PriceHistory.find({ offerId })
            .sort({ checkedAt: 1 })
            .select("price checkedAt -_id");

        const fullHistory = [
            ...history,
            { price: offer.currentPrice, checkedAt: offer.lastUpdated }
        ];

        return res.success("History fetched successfully", fullHistory, 200);
    } catch (error) {
        return res.error("Server error while fetching history", 500, error);
    }
};