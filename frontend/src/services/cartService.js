import api from "./api";

export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    const response = await api.post("/cart/add", {
      userId,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add to cart" };
  }
};

export const removeFromCart = async (userId, productId) => {
  try {
    const response = await api.delete("/cart/remove", {
      data: { userId, productId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to remove from cart" };
  }
};

export const updateCartItem = async (userId, productId, quantity) => {
  try {
    const response = await api.put("/cart/update", {
      userId,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update cart item" };
  }
};

export const getCartItems = async (userId) => {
  try {
    const response = await api.get(`/cart/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch cart items" };
  }
};

export const clearCart = async (userId) => {
  try {
    const response = await api.delete("/cart/clear", {
      data: { userId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to clear cart" };
  }
};
