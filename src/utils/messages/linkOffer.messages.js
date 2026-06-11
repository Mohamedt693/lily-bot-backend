const LINK_OFFER_MESSAGES = {
    SUCCESS: {
        CREATED: "Link offer added successfully to the system!",
        FETCHED_FOR_PRODUCT: "All price comparisons for this product retrieved successfully.",
        UPDATED: "Link offer details updated successfully.",
        DELETED: "Link offer deleted successfully.",
        SCRAPER_COMPLETED: "Price scraping and updating process completed successfully for all stores!"
    },
    ERROR: {
        NOT_FOUND: "Link offer not found.",
        REQUIRED_FIELDS: "Please provide all required fields (productId, storeName, country, url, priceSelector, currency).",
        INVALID_ENUM: "Invalid store name, country code, or currency code provided.",
        SCRAPER_FAILED: "An error occurred during the automatic scraping process.",
        SERVER_ERROR: "Internal server error while processing link offer data."
    }
};

export default LINK_OFFER_MESSAGES;