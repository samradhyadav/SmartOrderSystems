import express from "express";
import MenuItem from "../models/Menu.js"; // ES6 import
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
router.get("/", async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.status(200).json(menu);
  } catch (err) {
    console.error("Error fetching menu:", err.message);
    res.status(500).json({ error: "Failed to fetch menu", details: err.message });
  }
});

// @desc    Add new menu item
// @route   POST /api/menu
// @access  Admin
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, category, image, available } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ error: "Name, description, and price are required" });
    }

    const newItem = new MenuItem({
      name,
      description,
      price,
      category: category || "General",
      image: image || "",
      available: available !== undefined ? available : true,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Failed to add menu item:", err.message);
    res.status(500).json({ error: "Failed to add item", details: err.message });
  }
});

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Admin
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, category, image, available } = req.body;

    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Menu item not found" });

    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price !== undefined ? price : item.price;
    item.category = category || item.category;
    item.image = image || item.image;
    item.available = available !== undefined ? available : item.available;

    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (err) {
    console.error("Failed to update menu item:", err.message);
    res.status(500).json({ error: "Failed to update item", details: err.message });
  }
});

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Admin
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (err) {
    console.error("Failed to delete menu item:", err.message);
    res.status(500).json({ error: "Failed to delete item", details: err.message });
  }
});


export default router;
