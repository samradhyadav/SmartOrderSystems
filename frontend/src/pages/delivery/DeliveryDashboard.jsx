import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    axios
      .get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const markDelivered = (orderId) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `http://localhost:5000/api/orders/${orderId}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "Delivered" } : o
          )
        );
      })
      .catch((err) => console.error(err));
  };

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 shadow">
        <h1 className="text-2xl font-bold">Delivery Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>

      {/* Orders Section */}
      <div className="p-6 grid grid-cols-1 gap-4">
        {orders.length === 0 ? (
          <div>No orders assigned yet.</div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">Order #{order._id}</h2>
                <p>Status: {order.status}</p>
              </div>
              {order.status !== "Delivered" && (
                <button
                  onClick={() => markDelivered(order._id)}
                  className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
