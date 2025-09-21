// frontend/src/config.js

const dev =
  window.location.hostname === "localhost" ||
  window.location.hostname.startsWith("192.");

export const API_BASE_URL = dev
  ? "http://localhost:5001" // Local backend
  : "https://smartordersystems.onrender.com"; // Deployed backend
