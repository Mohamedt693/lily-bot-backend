import mongoose from 'mongoose';
import { Product } from '../models/product.model.js';
import { LinkOffer } from '../models/linkOffer.model.js';
import dotenv from 'dotenv';
dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // أضف هذه الأسطر لمسح البيانات القديمة قبل الإضافة
        await Product.deleteMany({}); 
        await LinkOffer.deleteMany({});
        console.log("Old data cleared.");

        // 1. تعريف المتغيرات أولاً
        const countries = ['EG', 'SA', 'AE', 'US', 'GB', 'CA'];
        const stores = ['Amazon', 'Noon', 'Sephora', 'Ulta', 'Jumia', 'AliExpress'];
        
        // 2. إنشاء المنتج
        const product = await Product.create({
            name: "CeraVe Moisturizing Cream",
            brand: "CeraVe",
            slug: "cerave-moisturizing-cream",
            description: "A premium moisturizing cream.",
            category: "skincare",
            budget: "medium",
            skinType: "dry",
            origin: "USA",
            images: ["https://example.com/cream.jpg"]
        });

        // 3. الآن يمكنك استخدام countries و stores بأمان
        const offers = countries.map((country, index) => ({
            productId: product._id,
            country: country,
            storeName: stores[index % 3], 
            currentPrice: (index + 1) * 100,
            currency: ['EGP', 'SAR', 'AED', 'USD', 'GBP', 'CAD'][index],
            affiliateUrl: `https://${stores[index % 3].toLowerCase()}.com/${country.toLowerCase()}/product/123`,
            isAvailable: true
        }));

        await LinkOffer.insertMany(offers);
        
        console.log("Database seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedData(); // قم بإلغاء التعليق لتشغيلها مرة واحدة