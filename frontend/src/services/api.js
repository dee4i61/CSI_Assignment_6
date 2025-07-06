// src/services/api.js
import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized: Please login again");
    }
    return Promise.reject(error);
  }
);

export default api;
