const PRODUCT_MESSAGES = {
  SUCCESS: {
    CREATED: "Product added successfully to Lily Closet database!",
    FETCHED_ALL: "All products retrieved successfully.",
    FETCHED_ONE: "Product details retrieved successfully.",
    UPDATED: "Product updated successfully.",
    DELETED: "Product deleted successfully from the system."
  },
  ERROR: {
    NOT_FOUND: "Product not found.",
    REQUIRED_FIELDS: "Please provide all required fields (name, description, category, budget, skinType, origin).",
    INVALID_BUDGET: "Invalid budget level. Must be 'اقتصادي', 'متوسط', or 'فاخر'.",
    SERVER_ERROR: "Internal server error while processing product data."
  }
};

export default PRODUCT_MESSAGES;