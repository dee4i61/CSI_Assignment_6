import api from "./api";

// Get All Products
export const getAllProducts = async () => {
  try {
    const { data } = await api.get("/products");
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Product Details
export const getProductDetails = async (id) => {
  try {
    const { data } = await api.get(`/product/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Get All Products
export const getAdminProducts = async () => {
  try {
    const { data } = await api.get("/admin/products");
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Create Product
export const createProduct = async (productData) => {
  try {
    const { data } = await api.post("/admin/product/new", productData);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Update Product
export const updateProduct = async (id, productData) => {
  try {
    const { data } = await api.put(`/admin/product/${id}`, productData);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Delete Product
export const deleteProduct = async (id) => {
  try {
    const { data } = await api.delete(`/admin/product/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create or Update Product Review
export const submitReview = async (reviewData) => {
  try {
    const { data } = await api.put("/review", reviewData);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get All Reviews of a Product
export const getProductReviews = async (productId) => {
  try {
    const { data } = await api.get(`/reviews?productId=${productId}`);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete a Review
export const deleteReview = async (reviewId, productId) => {
  try {
    const { data } = await api.delete(
      `/reviews?id=${reviewId}&productId=${productId}`
    );
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
