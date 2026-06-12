import axios from "axios";
import * as cheerio from "cheerio";
import pLimit from "p-limit";
import UserAgent from 'user-agents';
import { LinkOffer } from "../../models/linkOffer.model.js";
import { PriceHistory } from "../../models/priceHistory.model.js";
import { storeSelectors } from "./storeSelectors.js"; 
import LINK_OFFER_MESSAGES from "../messages/linkOffer.messages.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const updatePrices = async () => {
    try {
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const offers = await LinkOffer.find({ 
            lastUpdated: { $lt: fortyEightHoursAgo } 
        });

        if (offers.length === 0) {
            console.log("⚠️ No offers found that need updating.");
            return { success: true, message: "No offers to update" };
        }

        console.log(`🚀 Starting price sync for ${offers.length} links...`);

        let successCount = 0;
        const limit = pLimit(5); 

        const tasks = offers.map((offer) => {
            return limit(async () => {
                const userAgent = new UserAgent().toString(); 
                await delay(Math.floor(Math.random() * 2000) + 1000); 

                try {
                    const { data } = await axios.get(offer.affiliateUrl, {
                        headers: { "User-Agent": userAgent },
                        timeout: 15000,
                    });

                    const $ = cheerio.load(data);
                    
                    const selector = storeSelectors[offer.storeName]?.price;
                    if (!selector) throw new Error(`No selector configured for ${offer.storeName}`);
                    
                    const priceText = $(selector).text().trim();
                    const cleanPrice = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));

                    if (!isNaN(cleanPrice)) {
                        if (offer.currentPrice !== cleanPrice && offer.currentPrice > 0) {
                            await PriceHistory.create({
                                offerId: offer._id,
                                price: offer.currentPrice,
                                checkedAt: new Date(),
                            });
                            offer.lastPrice = offer.currentPrice;
                        }

                        offer.currentPrice = cleanPrice;
                        offer.lastUpdated = new Date();
                        offer.lastError = null;
                        await offer.save();
                        
                        successCount++; 
                        console.log(`✅ ${offer.storeName} updated: [${cleanPrice}]`);
                    } else {
                        throw new Error("Could not parse price");
                    }
                } catch (error) {
                    console.error(`❌ Error [${offer.storeName}]: ${error.message}`);
                    offer.lastError = error.message;
                    await offer.save();
                }
            });
        });

        await Promise.all(tasks);

        console.log(`✨ ${LINK_OFFER_MESSAGES.SUCCESS.SCRAPER_COMPLETED}`);
        console.log(`📊 Summary: Successfully updated ${successCount} out of ${offers.length} offers.`);
        
        return { success: true, updatedCount: successCount };

    } catch (err) {
        console.error(`🔴 Critical Scraper Error: ${err.message}`);
        return { success: false, error: err.message };
    }
};