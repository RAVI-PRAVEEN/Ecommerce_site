import axios from "axios";

const API_BASE = "http://localhost:8888"; // Tornado backend

export async function fetchProducts() {
  try {
    const response = await axios.get(`${API_BASE}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function addProduct(product) {
  try {
    const response = await axios.post(`${API_BASE}/products`, product);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await axios.delete(`${API_BASE}/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    return null;
  }
}
