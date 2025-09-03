// frontend/src/components/CartCard.jsx
import React from "react";

const CartCard = ({ item, onRemove }) => {
  return (
    <div className="flex justify-between items-center border p-3 rounded-lg mb-2">
      <div>
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-600">Qty: {item.quantity}</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="font-semibold">${item.price * item.quantity}</p>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 font-bold"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartCard;
