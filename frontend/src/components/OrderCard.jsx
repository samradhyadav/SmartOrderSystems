// frontend/src/components/OrderCard.jsx
import React from "react";

const OrderCard = ({ order }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md mb-2">
      <h3 className="font-bold text-lg">Order #{order._id}</h3>
      <p>Status: <span className="font-semibold">{order.status}</span></p>
      <p>Total: ${order.total}</p>
      <div className="mt-2">
        <h4 className="font-semibold">Items:</h4>
        <ul className="list-disc list-inside">
          {order.items.map((item) => (
            <li key={item.id}>{item.name} x {item.quantity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderCard;
