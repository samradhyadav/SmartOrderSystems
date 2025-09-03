// frontend/src/components/MenuCard.jsx
import React from "react";

const MenuCard = ({ item, onAddToCart }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold">{item.name}</h2>
      <p className="text-gray-600">{item.description}</p>
      <p className="text-green-700 font-semibold">${item.price}</p>
      <button
        onClick={() => onAddToCart(item)}
        className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default MenuCard;
