import React, { useEffect, useState } from "react";
import { fetchOrders } from "../../api/orders";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userId = "USER_ID"; // replace with actual logged-in user id

  useEffect(() => {
    const getOrders = async () => {
      const data = await fetchOrders(userId);
      setOrders(data);
    };
    getOrders();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} className="border p-4 mb-2 rounded">
              <h3 className="font-semibold">Order ID: {order._id}</h3>
              <p>Status: {order.status}</p>
              <ul className="list-disc ml-5 mt-2">
                {order.items.map((item) => (
                  <li key={item._id}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="font-bold mt-2">Total: ₹{order.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
