import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// GET /api/me -> get logged-in user's info
router.get("/me", protect, async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
