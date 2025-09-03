import React from "react";

const Cart = ({ cart, setCart }) => {
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center border p-2 mb-2 rounded">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p>Qty: {item.quantity}</p>
                <p>₹{item.price}</p>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <h3 className="font-bold mt-4">Total: ₹{total}</h3>
          <button className="bg-green-600 text-white px-4 py-2 mt-2 rounded hover:bg-green-700">
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
