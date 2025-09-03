import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // Map items to match schema structure
    const mappedItems = items.map((i) => ({
      menuId: i.menuItem, // your frontend sends menuItem
      quantity: i.quantity,
    }));

    const newOrder = await Order.create({
      customerId: req.user._id,
      items: mappedItems,
      totalAmount,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get customer orders
router.get("/order", protect, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate("items.menuId", "name price"); // populate menu items

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      items: order.items.map((i) => ({
        item: i.menuId,
        quantity: i.quantity,
      })),
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    }));

    res.json(formattedOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all orders (Admin only)
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    const orders = await Order.find()
      .populate("customerId", "name email")       // populate customer name & email
      .populate("items.menuId", "name price");    // populate menu item name & price

    // Transform the orders to make it easier for frontend
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      customer: order.customerId,               // populated customer
      items: order.items.map((i) => ({
        item: i.menuId,                         // populated menu item
        quantity: i.quantity,
      })),
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    }));

    res.json(formattedOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (Admin only)
router.put("/:id/status", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const orderStatuses = ["Pending", "Preparing", "Out for Delivery", "Delivered"];
    const currentIndex = orderStatuses.indexOf(order.status);
    const newIndex = orderStatuses.indexOf(status);

    if (newIndex !== currentIndex + 1) {
      return res.status(400).json({ message: "Cannot skip steps in order workflow" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;
