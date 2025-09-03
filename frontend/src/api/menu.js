import axios from "axios";

const API_URL = "http://localhost:5001/api/menu";

export const fetchMenu = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addMenuItem = async (item) => {
  const res = await axios.post(API_URL, item);
  return res.data;
};

export const updateMenuItem = async (id, updatedItem) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedItem);
  return res.data;
};
