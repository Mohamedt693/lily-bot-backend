import mongoose from 'mongoose';

const APPROVED_CATEGORIES = [
    "Cleanser",
    "Moisturizer",
    "Serum",
    "Sunscreen",
    "Toner",
    "Exfoliator",
    "Lip Care"
];

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        required: true 
    },    
    category: {
        type: String,
        required: true,
        enum: {
            values: APPROVED_CATEGORIES,
            message: '{VALUE} ليس تصنيفاً معتمداً. يرجى الاختيار من القائمة المعتمدة فقط.'
        }
    },
    budget: { 
        type: String, 
        required: true, 
        enum: ['economy', 'medium', 'luxury'] 
    },
    skinType: { 
        type: String, 
        required: true 
    }, 
    link: { 
        type: String, 
    },
    origin: { 
        type: String, 
        required: true 
    }, 
    coupons: [
        { 
            type: String, 
            trim: true,
            default: ['lilycloset']
        }
    ], 
    images: [
        { 
            type: String, 
            required: true 
        }
    ], 
    ingredients: [
        { 
            type: String, 
            trim: true 
        }
    ] 
}, { 
    timestamps: true 
});

export const Product = mongoose.model('Product', productSchema);