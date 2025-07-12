import api from "./api";

export const addAddress = async (addressData) => {
  try {
    const response = await api.post("/addresses/", addressData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to add address",
      }
    );
  }
};

export const listAddresses = async () => {
  try {
    const response = await api.get("/addresses");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch addresses",
      }
    );
  }
};

export const updateAddress = async (id, addressData) => {
  try {
    const response = await api.patch(`/addresses/${id}`, addressData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to update address",
      }
    );
  }
};

export const deleteAddress = async (id) => {
  try {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to delete address",
      }
    );
  }
};
