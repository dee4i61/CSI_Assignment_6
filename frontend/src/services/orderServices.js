import api from "./api";

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const { data } = await api.post("/order/new", orderData);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get order details
export const getOrderDetails = async (id) => {
  try {
    const { data } = await api.get(`/order/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get current user's orders
export const getMyOrders = async () => {
  try {
    const { data } = await api.get("/orders/me");
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Get all orders
export const getAllOrders = async () => {
  try {
    const { data } = await api.get("/admin/orders");
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Update order status
export const updateOrderStatus = async (id, status) => {
  try {
    const { data } = await api.put(`/admin/order/${id}`, { status });
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Delete order
export const deleteOrder = async (id) => {
  try {
    const { data } = await api.delete(`/admin/order/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
