import api from "./api";

export const createOrder = async (data) => {
  try {
    const response = await api.post("/order/new", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create order" };
  }
};

export const getOrder = async (id) => {
  try {
    const response = await api.get(`/order/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch order" };
  }
};

export const getMyOrders = async () => {
  try {
    const response = await api.get("/orders/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch orders" };
  }
};

export const cancelOrder = async (id) => {
  try {
    const response = await api.patch(`/order/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to cancel order" };
  }
};

export const getAllOrders = async () => {
  try {
    const response = await api.get("/admin/orders");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch all orders" };
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.patch(`/admin/order/${id}`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update order status" };
  }
};
