import { LinkOffer } from "../models/linkOffer.model.js";
import LINK_OFFER_MESSAGES from "../utils/messages/linkOffer.messages.js";
import { updatePrices } from "../utils/jobs/scraper.js";

export const addLinkOffer = async (req, res) => {
    try {
        const { productId, storeName, country, url, priceSelector, currency } = req.body;

        if (
            !productId ||
            !storeName ||
            !country ||
            !url ||
            !priceSelector ||
            !currency
        ) {
            return res.error(LINK_OFFER_MESSAGES.ERROR.REQUIRED_FIELDS, 400);
        }

        const newOffer = new LinkOffer(req.body);
        const savedOffer = await newOffer.save();

        return res.success(LINK_OFFER_MESSAGES.SUCCESS.CREATED, savedOffer, 201);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.error(LINK_OFFER_MESSAGES.ERROR.INVALID_ENUM, 400, error);
        }
        return res.error(LINK_OFFER_MESSAGES.ERROR.SERVER_ERROR, 500, error);
    }
};

export const getOffersByProductId = async (req, res) => {
    try {
        const { productId } = req.params;

        const offers = await LinkOffer.find({ productId }).sort({
            currentPrice: 1,
        });

        return res.success(
            LINK_OFFER_MESSAGES.SUCCESS.FETCHED_FOR_PRODUCT,
            offers,
            200,
        );
    } catch (error) {
        return res.error(LINK_OFFER_MESSAGES.ERROR.SERVER_ERROR, 500, error);
    }
};

export const updateLinkOffer = async (req, res) => {
    try {
        const updatedOffer = await LinkOffer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true },
        );

        if (!updatedOffer) {
            return res.error(LINK_OFFER_MESSAGES.ERROR.NOT_FOUND, 404);
        }
        return res.success(LINK_OFFER_MESSAGES.SUCCESS.UPDATED, updatedOffer, 200);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.error(LINK_OFFER_MESSAGES.ERROR.INVALID_ENUM, 400, error);
        }
        return res.error(LINK_OFFER_MESSAGES.ERROR.SERVER_ERROR, 500, error);
    }
};

export const deleteLinkOffer = async (req, res) => {
    try {
        const deletedOffer = await LinkOffer.findByIdAndDelete(req.params.id);

        if (!deletedOffer) {
            return res.error(LINK_OFFER_MESSAGES.ERROR.NOT_FOUND, 404);
        }
        return res.success(LINK_OFFER_MESSAGES.SUCCESS.DELETED, null, 200);
    } catch (error) {
        return res.error(LINK_OFFER_MESSAGES.ERROR.SERVER_ERROR, 500, error);
    }
};

export const triggerPriceScraper = async (req, res) => {
    try {
        console.log("⚡ Manual Scraper Triggered by Admin...");
        const result = await updatePrices();

        if (result && result.success) {
            return res.success(
                LINK_OFFER_MESSAGES.SUCCESS.SCRAPER_COMPLETED,
                null,
                200,
            );
        } else {
            return res.error(
                LINK_OFFER_MESSAGES.ERROR.SCRAPER_FAILED,
                400,
                result?.error,
            );
        }
    } catch (error) {
        return res.error(LINK_OFFER_MESSAGES.ERROR.SERVER_ERROR, 500, error);
    }
};
