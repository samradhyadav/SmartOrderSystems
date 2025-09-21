import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config.js";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState("Customer");
  const cartRef = useRef();
  const [sortOption, setSortOption] = useState("");

  const token = localStorage.getItem("token");

  const authAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch customer info
  useEffect(() => {
  const fetchCustomer = async () => {
    if (!token) return;
    try {
      const res = await authAxios.get(`${API_BASE_URL}/api/me`);
      setCustomerName(res.data.name || "Customer");
    } catch (err) {
      console.error("Failed to fetch customer info", err.response?.data || err.message);
    }
  };
  fetchCustomer();
}, [token]);

  // Fetch menu
  useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await authAxios.get(`${API_BASE_URL}/api/menu`);
      setMenu(res.data);
    } catch (err) {
      console.error("Failed to fetch menu", err.response?.data || err.message);
    }
  };
  fetchMenu();
}, []);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
    };
    if (showCart) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCart]);

  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //  Apply sorting on filtered menu
  const sortedMenuItems = [...filteredMenu].sort((a, b) => {
    if (sortOption === "priceLowHigh") return a.price - b.price;
    if (sortOption === "priceHighLow") return b.price - a.price;
    if (sortOption === "az") return a.name.localeCompare(b.name);
    if (sortOption === "za") return b.name.localeCompare(a.name);
    return 0;
  });

  const addToCart = (item) => {
    const exists = cart.find((c) => c._id === item._id);
    if (exists) {
      setCart(
        cart.map((c) =>
          c._id === item._id ? { ...c, qty: c.qty + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
    setShowCart(true);
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart(cart.filter((c) => c._id !== id));
    } else {
      setCart(
        cart.map((c) => (c._id === id ? { ...c, qty } : c))
      );
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((c) => c._id !== id));
  };

  // Place order (FIXED)
  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        alert("User not logged in");
        return;
      }

      const items = cart.map((item) => {
        const id =
          item._id !== undefined
            ? item._id
            : item.menuId !== undefined
            ? item.menuId
            : item.id !== undefined
            ? item.id
            : undefined;

        return {
          menuId: id,
          menuItem: id,
          quantity: item.qty ?? item.quantity ?? 1,
        };
      });

      const missing = items.find(
        (it) => !it.menuId || !it.quantity || it.quantity <= 0
      );
      if (missing) {
        console.error("BAD CART ITEM:", missing, "FULL CART:", cart);
        alert("One of the items is missing id/quantity. Remove and re-add it.");
        return;
      }

      const totalAmount = cart.reduce((sum, item) => {
        const qty = item.qty ?? item.quantity ?? 1;
        const priceNum = Number(item.price) || 0;
        return sum + priceNum * qty;
      }, 0);

      if (!items.length || totalAmount <= 0) {
        alert("Cart is empty or total is invalid.");
        return;
      }

      const payload = { items, totalAmount };

      console.log("DEBUG: order payload →", payload);

      await axios.post(`${API_BASE_URL}/api/orders`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Order placed successfully!");
      setCart([]);
      setShowCart(false);
    } catch (err) {
      console.error("Failed to place order", err.response?.data || err.message);
      alert(
        "Failed to place order: " +
          (err.response?.data?.message || "Server error")
      );
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-100 text-gray-800">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-rose-600">
          Welcome, {customerName}
        </h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring focus:ring-rose-400"
          />
          {/* Sort dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-2 py-1 w-28 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring focus:ring-rose-400"
          >
            <option value="">Sort By</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="az">Name: A–Z</option>
            <option value="za">Name: Z–A</option>
          </select>
          <button
            onClick={logout}
            className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedMenuItems.map((item) => (
          <div
            key={item._id}
            className={`bg-white p-4 rounded shadow hover:shadow-lg relative ${
              !item.available ? "opacity-50" : ""
            }`}
          >
            <img
              src={item.image || "https://via.placeholder.com/150"}
              alt={item.name}
              className="w-full h-40 object-cover rounded mb-3"
            />
            <h3 className="text-xl font-bold">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="mt-2 text-rose-600 font-semibold">₹{item.price}</p>

            {item.available ? (
              <div className="flex justify-between mt-3 items-center">
                <button
                  onClick={() => addToCart(item)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Add to Cart
                </button>
                {cart.find((c) => c._id === item._id) && (
                  <span className="font-semibold">
                    Qty: {cart.find((c) => c._id === item._id)?.qty}
                  </span>
                )}
              </div>
            ) : (
              <span className="absolute bottom-3 right-3 text-red-500 font-semibold">
                Not Available
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCart(!showCart)}
          className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 z-40"
        >
          🛒 Your Cart ({cart.reduce((sum, c) => sum + c.qty, 0)})
        </button>
      )}

      {/* Bottom-Right Sidebar Cart */}
      {showCart && (
        <div
          ref={cartRef}
          className="fixed bottom-20 right-6 h-auto max-h-[60vh] w-72 bg-white shadow-2xl p-4 overflow-y-auto rounded-lg z-50"
        >
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cart.map((c) => (
              <div
                key={c._id}
                className="flex justify-between items-center mb-3"
              >
                <div>
                  <span className="font-semibold">{c.name}</span>
                  <p className="text-sm">Qty: {c.qty}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQty(c._id, c.qty - 1)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <button
                    onClick={() => updateQty(c._id, c.qty + 1)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(c._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}

          {cart.length > 0 && (
            <div className="mt-4">
              <p className="font-bold">
                Total: ₹
                {cart.reduce((sum, c) => sum + c.price * c.qty, 0)}
              </p>
              <button
                onClick={placeOrder}
                className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Place Order
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
