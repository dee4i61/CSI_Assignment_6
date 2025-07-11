import api from "./api";

// Get All Products
export const getAllProducts = async (query = {}) => {
  try {
    const response = await api.get("/products", { params: query });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch products" };
  }
};

// Get Product Details
export const getProductDetails = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch product details" }
    );
  }
};

// Admin: Get All Products
export const getAdminProducts = async () => {
  try {
    const response = await api.get("/admin/products");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch admin products" };
  }
};

// Admin: Create Product
export const createProduct = async (productData) => {
  try {
    const response = await api.post("/admin/product/new", productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create product" };
  }
};

// Admin: Update Product
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/admin/product/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update product" };
  }
};

// Admin: Delete Product
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/admin/product/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete product" };
  }
};

// Create or Update Product Review
export const submitReview = async (reviewData) => {
  try {
    const response = await api.put("/review", reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to submit review" };
  }
};

// Get All Reviews of a Product
export const getProductReviews = async (productId) => {
  try {
    const response = await api.get(`/reviews?productId=${productId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch product reviews" }
    );
  }
};

// Delete a Review
export const deleteReview = async (reviewId, productId) => {
  try {
    const response = await api.delete(
      `/reviews?id=${reviewId}&productId=${productId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete review" };
  }
};

// Admin: Set Product Flags
export const setProductFlags = async (id, flagsData) => {
  try {
    const response = await api.patch(`/admin/product/${id}/flags`, flagsData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to set product flags" };
  }
};
