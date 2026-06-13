import mongoose from 'mongoose';
import connectDB from '../../config/db.js';
import { updatePrices } from './scraper.js';
import dotenv from 'dotenv';

dotenv.config();

const runScraper = async () => {
    try {
        console.log("🕒 Standalone Scraper started...");
        
        await connectDB();

        const result = await updatePrices();
        console.log("✅ Scraper Finished:", result);

    } catch (error) {
        console.error("❌ Critical Error in Standalone Scraper:", error);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Database connection closed. Exiting.");
        process.exit(0);
    }
};

runScraper();