import axios from "axios";

const API_URL = "http://localhost:5001/api/users";

export const fetchUser = async (userId) => {
  const res = await axios.get(`${API_URL}/${userId}`);
  return res.data;
};
