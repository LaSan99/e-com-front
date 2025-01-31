import axios from "axios";
import { API_URL } from "../config/config";

// Create axios instance with dynamic Content-Type
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for CORS with credentials
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    const { token } = JSON.parse(user);
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Set Content-Type based on the request data
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// Auth API
export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (userData) => api.post("/auth/register", userData);

// Products API
export const getProducts = (searchQuery) => {
  const params = searchQuery ? { search: searchQuery } : {};
  return api.get("/products", { params });
};
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) =>
  api.post("/products", productData);
export const updateProduct = (id, productData) =>
  api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Cart API
export const getCart = () =>
  api.get("/cart").then((response) => {
    if (!response.data || !response.data.items) {
      throw new Error("Invalid cart data received");
    }
    return response;
  });

export const addToCart = (productData) =>
  api.post("/cart/add", productData).then((response) => {
    if (!response.data || !response.data.items) {
      throw new Error("Invalid cart data received");
    }
    return response;
  });

export const updateCartItem = (itemId, quantity) =>
  api.put(`/cart/update/${itemId}`, { quantity }).then((response) => {
    if (!response.data || !response.data.items) {
      throw new Error("Invalid cart data received");
    }
    return response;
  });

export const removeFromCart = (itemId) =>
  api.delete(`/cart/remove/${itemId}`).then((response) => {
    if (!response.data || !response.data.items) {
      throw new Error("Invalid cart data received");
    }
    return response;
  });

// User Management API
export const getCustomers = () => api.get("/users");
export const updateCustomer = (id, userData) =>
  api.put(`/users/${id}`, userData);
export const deleteCustomer = (id) => api.delete(`/users/${id}`);

// Chat API
export const sendChatMessage = async (message) => {
  try {
    const response = await api.post('/chat', { message });
    return response.data;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
};
