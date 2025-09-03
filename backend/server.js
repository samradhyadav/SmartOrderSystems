import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Parse JSON
app.use(express.json());

// ----------------------
// ✅ CORS setup
// ----------------------
const allowedOrigins = [
  "http://localhost:5174",          // frontend dev
  process.env.FRONTEND_URL || ""    // deployed frontend
].filter(Boolean);

if (process.env.NODE_ENV !== "production") {
  // Allow all origins in development
  app.use(cors());
} else {
  // Restrict origins in production
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));
}

// ----------------------
// ✅ Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/me", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// ----------------------
// ✅ Server
// ----------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(` Backend running at http://localhost:${PORT}`);
});
