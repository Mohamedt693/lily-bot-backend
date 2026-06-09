Lily Bot Backend
A robust Node.js and Express backend service designed for a skincare consultation platform. It integrates with Gemini AI to provide personalized skincare routines, product recommendations, and expert advice based on a specific database of cosmetic products.

Features
AI-Powered Consultation: Integrates with Gemini AI to act as a professional skincare assistant.

Dynamic Product Management: Full CRUD capabilities for managing skincare products, categories, skin types, and budgets.

Smart Filtering: Advanced filtering logic for precise product recommendations.

Secure Architecture: Built with security best practices to prevent prompt injection and ensure data integrity.

Scalable Design: Optimized for deployment on cloud platforms with environment-based configuration.

Tech Stack
Runtime: Node.js

Framework: Express.js

Database: MongoDB (via Mongoose)

AI Integration: Google Generative AI (Gemini)

Security: Helmet, CORS, and custom middleware for request validation.

API Endpoints
POST /api/consultation: Handles user consultation requests and returns AI-generated advice.

GET /api/products: Retrieves all products.

POST /api/products: Adds a new product.

PUT /api/products/:id: Updates an existing product.

DELETE /api/products/:id: Deletes a product.

1-Installation and Setup
Clone the repository: git clone https://github.com/Mohamedt693/lily-bot-backend.git
cd lily-bot-backend

2-Install dependencies: npm install

3-Configure environment variables:
Create a .env file in the root directory and add the following: 
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
BRAND_NAME=LilyBot

4-Start the server: npm start

License
This project is proprietary. All rights reserved.