import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/me -> get logged-in user's info
router.get("/me", protect, (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id: req.user._id,   // 🔹 use "_id" (to match DB & login response)
      name: req.user.name,
      email: req.user.email,
      role: req.user.role, // 🔹 include role so frontend can redirect properly
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
