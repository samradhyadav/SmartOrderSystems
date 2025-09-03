import React, { useEffect, useState } from "react";
import { fetchOrders } from "../../api/orders";

const AssignedOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
      fetchOrders("deliveryUserId").then(setOrders).catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Assigned Orders</h1>
      {orders.map(order => (
        <div key={order._id} className="bg-white p-4 my-2 rounded shadow">
          <p>Order ID: {order._id}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default AssignedOrders;
