import api from "./api";

export const createContactMessage = async (data) => {
  try {
    const response = await api.post("/contact", data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to create contact message" }
    );
  }
};

export const getAllContacts = async () => {
  try {
    const response = await api.get("/admin/contacts");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch contacts" };
  }
};

export const respondToContact = async (id, responseMessage) => {
  try {
    const response = await api.patch(`/admin/contact/${id}/respond`, {
      responseMessage,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to respond to contact" };
  }
};
