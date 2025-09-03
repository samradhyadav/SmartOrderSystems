import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") navigate("/admin-dashboard");
    else if (role === "customer") navigate("/customer-dashboard");
    else if (role === "delivery") navigate("/delivery-dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "${API_BASE_URL}/api/auth/login",
        { email, password }
      );

      // Save token & role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user", JSON.stringify({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      }));


      // 🔎 Debugging logs
      console.log("DEBUG: Login response", res.data);
      console.log("DEBUG: Token saved ->", localStorage.getItem("token"));
      console.log("DEBUG: Role saved ->", localStorage.getItem("role"));
      console.log("DEBUG: User saved ->", localStorage.getItem("user"));

      // Redirect based on role
      if (res.data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (res.data.role === "customer") {
        navigate("/customer-dashboard");
      } else if (res.data.role === "delivery") {
        navigate("/delivery-dashboard");
      } else {
        setError("Unknown role received from server");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
