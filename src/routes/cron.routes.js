import express from 'express';
import { updatePrices } from '../utils/jobs/scraper.js';

const router = express.Router();

router.post('/trigger-sync', async (req, res) => {
    const secret = req.headers['x-cron-secret'];
    if (secret !== process.env.CRON_SECRET) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("🚀 Manual cron trigger received...");
    
    updatePrices()
        .then(result => console.log("✨ Sync completed:", result))
        .catch(err => console.error("❌ Sync failed:", err));

    res.status(200).json({ message: "Sync job initiated" });
});

export default router;