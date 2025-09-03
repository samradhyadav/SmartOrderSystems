import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, itemId: null, itemName: "" });
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOption, setSortOption] = useState("");


  const BASE_URL = "/api/menu";
  const ORDER_URL = "/api/orders";
  const token = localStorage.getItem("token");

  const authAxios = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, menuRes] = await Promise.all([
          authAxios.get(ORDER_URL),
          authAxios.get(BASE_URL)
        ]);
        setOrders(orderRes.data);
        setMenu(menuRes.data);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        addToast("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleAddOrEditItem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category || "General",
        image: form.image || "",
        available: true
      };

      if (!token) {
        addToast("Unauthorized! Please login again.", "error");
        return navigate("/login");
      }

      if (editingId) {
        await authAxios.put(`${BASE_URL}/${editingId}`, payload);
        addToast("Item updated successfully!", "success");
        setEditingId(null);
      } else {
        await authAxios.post(BASE_URL, payload);
        addToast("Item added successfully!", "success");
      }

      setForm({ name: "", description: "", price: "", category: "", image: "" });
      setModalOpen(false);
      const updatedMenu = await authAxios.get(BASE_URL);
      setMenu(updatedMenu.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      addToast("Failed to add/update item", "error");
    }
  };

  const handleEditClick = (item) => {
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category, image: item.image });
    setEditingId(item._id);
    setModalOpen(true);
  };

 const confirmDelete = async () => {
    try {
      await authAxios.delete(`${BASE_URL}/${deleteModal.itemId}`);
      setMenu(menu.filter((item) => item._id !== deleteModal.itemId));
      addToast("Item deleted successfully!", "success");
    } catch (err) {
      addToast("Failed to delete item", "error");
    } finally {
      setDeleteModal({ open: false, itemId: null, itemName: "" });
    }
  };

  const filteredOrders = orders
  .filter((order) =>
    filterStatus ? order.status === filterStatus : true
  )
  .sort((a, b) => {
    if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOption === "high") return b.totalAmount - a.totalAmount;
    if (sortOption === "low") return a.totalAmount - b.totalAmount;
    return 0;
  });


  const toggleAvailability = async (item) => {
    try {
      await authAxios.put(`${BASE_URL}/${item._id}`, { available: !item.available });
      setMenu(menu.map((m) => (m._id === item._id ? { ...m, available: !m.available } : m)));
      addToast(item.available ? "Marked Unavailable" : "Marked Available", "success");
    } catch (err) {
      addToast("Failed to update availability", "error");
    }
  };

  const filteredMenu = menu.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-100 text-gray-800">
      {/* Toasts */}
      {toasts.map((t) => (
        <div key={t.id} className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className={`transform transition-all duration-300 ease-out bg-white border-2 px-8 py-4 rounded shadow-lg text-center text-lg font-semibold pointer-events-auto ${t.type === "success" ? "border-green-500 text-green-700" : "border-red-500 text-red-700"}`}>
            {t.message}
          </div>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">Delete Item</h2>
            <p className="mb-6">Are you sure you want to delete <span className="font-bold">{deleteModal.itemName}</span>?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteModal({ open: false, itemId: null, itemName: "" })}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-rose-600">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring focus:ring-rose-400"
          />
          <button onClick={() => { setEditingId(null); setModalOpen(true); }} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Add New Item</button>
          <button onClick={handleLogout} className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
            <ArrowRightOnRectangleIcon className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>


      {loading ? (
        <p className="text-center text-gray-500">Loading dashboard...</p>
      ) : (
        <>
        {/* Filter & Sort Controls */}
<div className="flex justify-end gap-2">
  {/* Filter by Status */}
  <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    className="border rounded px-2 py-1 shadow-sm"
  >
    <option value="">All Status</option>
    <option value="Pending">Pending</option>
    <option value="Confirmed">Confirmed</option>
    <option value="Preparing">Preparing</option>
    <option value="Out for Delivery">Out for Delivery</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
  </select>

  {/* Sort Options */}
  <select
    value={sortOption}
    onChange={(e) => setSortOption(e.target.value)}
    className="border rounded shadow-sm"
  >
    <option value="">Sort By</option>
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
    <option value="high">Amount: High → Low</option>
    <option value="low">Amount: Low → High</option>
  </select>
</div>

          {/* Orders Table */}
<section className="mb-10">
  <h2 className="text-2xl font-semibold mb-4">All Customer Orders ⬇️</h2>
  <div className="overflow-x-auto bg-white rounded shadow">
    <table className="min-w-full">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-3 text-left">Customer</th>
          <th className="p-3 text-left">Items</th>
          <th className="p-3 text-left">Total Amount</th> {/* ✅ NEW */}
          <th className="p-3 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? filteredOrders.map((order) => (
          <tr key={order._id} className="border-b border-gray-300">
            <td className="p-3">{order.customer?.name || "Unknown"}</td>
            <td className="p-3">
              {order.items?.length > 0 ? (
                <ul className="list-disc ml-5">
                  {order.items.map((i, idx) => (
                    <li key={idx}>
                      {i.item?.name || "Unnamed Item"} × {i.quantity}
                    </li>
                  ))}
                </ul>
              ) : (<span>No items</span>)}
            </td>
            <td className="p-3 font-semibold">
              ₹{order.items?.reduce((acc, i) => acc + (i.item?.price || 0) * i.quantity, 0) || 0}
            </td> {/* ✅ NEW */}
            <td className="p-3">
              <div className="flex flex-col min-h-[40px] justify-center gap-1">
                {order.status === "Pending" && (
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-all"
                    onClick={async () => {
                      const res = await authAxios.put(`${ORDER_URL}/${order._id}/status`, { status: "Preparing" });
                      setOrders(orders.map(o => o._id === order._id ? res.data : o));
                      addToast("Order Accepted!", "success");
                    }}
                  >Accept Order</button>
                )}
                {order.status === "Preparing" && (
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-all"
                    onClick={async () => {
                      const res = await authAxios.put(`${ORDER_URL}/${order._id}/status`, { status: "Out for Delivery" });
                      setOrders(orders.map(o => o._id === order._id ? res.data : o));
                      addToast("Order Out for Delivery!", "success");
                    }}
                  >Mark Out for Delivery</button>
                )}
                {order.status === "Out for Delivery" && (
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-all"
                    onClick={async () => {
                      const res = await authAxios.put(`${ORDER_URL}/${order._id}/status`, { status: "Delivered" });
                      setOrders(orders.map(o => o._id === order._id ? res.data : o));
                      addToast("Order Delivered!", "success");
                    }}
                  >Mark Delivered</button>
                )}
                {order.status === "Delivered" && <span className="font-semibold">{order.status}</span>}
              </div>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan="4" className="p-3 text-center text-gray-500">No orders found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</section>


          {/* Menu Modal */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-96 relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setModalOpen(false)}>✖</button>
                <h2 className="text-xl font-semibold mb-4">{editingId ? "✏️ Edit Menu Item" : " Add New Menu Item"}</h2>
                <form onSubmit={handleAddOrEditItem} className="space-y-4">
                  <input type="text" name="name" placeholder="Dish Name" value={form.name} onChange={handleFormChange} className="w-full p-2 rounded border" required />
                  <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleFormChange} className="w-full p-2 rounded border" required />
                  <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleFormChange} className="w-full p-2 rounded border" required />
                  <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleFormChange} className="w-full p-2 rounded border" />
                  <input type="text" name="image" placeholder="Image URL" value={form.image} onChange={handleFormChange} className="w-full p-2 rounded border" />
                  <button type="submit" className="w-full bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700">{editingId ? "Update Item" : "Add Item"}</button>
                </form>
              </div>
            </div>
          )}

          {/* Menu List */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Menu Items 📋</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredMenu.length > 0 ? filteredMenu.map((item) => (
                <div key={item._id} className={`bg-white p-4 rounded shadow hover:shadow-lg flex flex-col justify-between transition ${!item.available ? "opacity-50" : ""}`}>
                  <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} className="w-full h-40 object-cover rounded mb-3" />
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-rose-600 font-semibold">₹{item.price}</p>
                    {!item.available && <span className="text-red-500 font-semibold">Unavailable</span>}
                  </div>
                  <div className="mt-3 flex justify-between items-end">
                    <button onClick={() => handleEditClick(item)} className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                      <PencilIcon className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => toggleAvailability(item)} className={`px-2 py-1 rounded ${item.available ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-gray-500 text-white hover:bg-gray-600"}`}>
                      {item.available ? "Mark Unavailable" : "Mark Available"}
                    </button>
                    <button onClick={() => setDeleteModal({ open: true, itemId: item._id, itemName: item.name })}
                      className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                      <TrashIcon className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500">No menu items available.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
