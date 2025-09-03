// controllers/orderController.js 
import Order from "../models/Order.js"; 

// Create a new order 
export const createOrder = async (req, res) => { try { const { items, totalPrice } = req.body; if (!items || items.length === 0) { return res.status(400).json({ message: "No items in order" }); } 
const order = new Order({ user: req.user._id, // comes from protect middleware items, totalPrice, });                                                                                                   
const savedOrder = await order.save(); res.status(201).json(savedOrder); } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); } }; // Get all orders for logged-in user 

export const getOrders = async (req, res) => { try { const orders = await Order.find({ user: req.user._id }).populate("items.menuItem"); res.status(200).json(orders); } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); } };