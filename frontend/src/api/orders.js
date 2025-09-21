import axios from "axios";

const API_URL = "https://smartordersystems.onrender.com/api/orders";

// Place a new order
export const placeOrder = async (order) => {
  try {
    const res = await axios.post(API_URL, order);
    return res.data;
  } catch (err) {
    console.error("Error placing order:", err.response?.data || err.message);
    throw err;
  }
};

// Fetch orders for a specific user
export const fetchOrders = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching orders:", err.response?.data || err.message);
    return [];
  }
};

// Fetch all orders (for admin)
export const fetchAllOrders = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching all orders:", err.response?.data || err.message);
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await axios.put(`${API_URL}/${orderId}`, { status });
    return res.data;
  } catch (err) {
    console.error("Error updating order:", err.response?.data || err.message);
    throw err;
  }
};
