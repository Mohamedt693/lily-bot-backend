import axios from "axios";
import * as cheerio from "cheerio";
import pLimit from "p-limit"; 
import { LinkOffer } from "../../models/linkOffer.model.js";
import LINK_OFFER_MESSAGES from "../messages/linkOffer.messages.js";

export const updatePrices = async () => {
    try {
        const offers = await LinkOffer.find({});
        console.log(`🚀 Starting price scraping for ${offers.length} links...`);

        const limit = pLimit(5);

        const tasks = offers.map((offer) => {
            return limit(async () => {
                try {
                    console.log(`⏳ Checking: ${offer.storeName} - Product ID: ${offer.productId}`);

                    const { data } = await axios.get(offer.url, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        },
                        timeout: 15000, 
                    });

                    const $ = cheerio.load(data);
                    const priceText = $(offer.priceSelector).text().trim();

                    if (!priceText) throw new Error("Price selector not found");

                    const cleanPrice = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));

                    if (!isNaN(cleanPrice)) {
                        if (offer.currentPrice !== cleanPrice && offer.currentPrice > 0) {
                            offer.lastPrice = offer.currentPrice;
                        }
                        offer.currentPrice = cleanPrice;
                        offer.lastUpdated = new Date();
                        await offer.save();
                        console.log(`✅ ${offer.storeName} updated: ${cleanPrice}`);
                    }
                } catch (error) {
                    console.error(`❌ Error [${offer.storeName}]: ${error.message}`);
                }
            });
        });

        await Promise.all(tasks);

        console.log(`✨ ${LINK_OFFER_MESSAGES.SUCCESS.SCRAPER_COMPLETED}`);
        return { success: true };

    } catch (err) {
        console.error(`🔴 Critical Error: ${err.message}`);
        return { success: false, error: err.message };
    }
};