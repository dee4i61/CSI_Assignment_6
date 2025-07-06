import api from "./api";

export const addToWishlist = async (userId, productId) => {
  try {
    const response = await api.post("/wishlist/add", { userId, productId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add to wishlist" };
  }
};

export const removeFromWishlist = async (userId, productId) => {
  try {
    const response = await api.delete("/wishlist/remove", {
      data: { userId, productId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to remove from wishlist" };
  }
};

export const getWishlist = async (userId) => {
  try {
    const response = await api.get(`/wishlist/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch wishlist" };
  }
};
