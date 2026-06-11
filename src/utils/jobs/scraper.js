import axios from "axios";
import * as cheerio from "cheerio";
import { LinkOffer } from "../../models/linkOffer.model.js";
import LINK_OFFER_MESSAGES from "../messages/linkOffer.messages.js";

export const updatePrices = async () => {
    try {
        const offers = await LinkOffer.find({});
        console.log(`🚀 Starting price scraping for ${offers.length} links...`);

        for (const offer of offers) {
            try {
                console.log(
                    `⏳ Checking: ${offer.storeName} (${offer.country}) - Product ID: ${offer.productId}`,
                );

                const { data } = await axios.get(offer.url, {
                    headers: {
                        "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
                    },
                    timeout: 10000, 
                });

                const $ = cheerio.load(data);

                const priceText = $(offer.priceSelector).text().trim();

                if (!priceText) {
                    console.log(
                        `⚠️ ${LINK_OFFER_MESSAGES.ERROR.NOT_FOUND} (No text found at selector for ${offer.storeName})`,
                    );
                    continue;
                }

                const cleanPrice = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));

                if (!isNaN(cleanPrice)) {
                    if (offer.currentPrice !== cleanPrice && offer.currentPrice > 0) {
                        offer.lastPrice = offer.currentPrice;
                    }

                    offer.currentPrice = cleanPrice;
                    offer.lastUpdated = new Date();

                    await offer.save();

                    console.log(
                        `✅ ${offer.storeName} updated. Current: [ ${offer.currentPrice} ] | Last: [ ${offer.lastPrice} ] ${offer.currency}`,
                    );
                } else {
                    console.log(
                        `⚠️ ${LINK_OFFER_MESSAGES.ERROR.INVALID_ENUM} (Failed to parse price string to number for ${offer.storeName}). Text was: "${priceText}"`,
                    );
                }

                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (error) {
                console.error(`❌ Store Error [${offer.storeName}]: ${error.message}`);
            }
        }

        console.log(`✨ ${LINK_OFFER_MESSAGES.SUCCESS.SCRAPER_COMPLETED}`);
        return {
            success: true,
            message: LINK_OFFER_MESSAGES.SUCCESS.SCRAPER_COMPLETED,
        };
    } catch (err) {
        console.error(
            `🔴 ${LINK_OFFER_MESSAGES.ERROR.SCRAPER_FAILED}:`,
            err.message,
        );
        return {
            success: false,
            message: LINK_OFFER_MESSAGES.ERROR.SCRAPER_FAILED,
            error: err.message,
        };
    }
};
