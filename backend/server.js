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
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",")
  : [];

if (process.env.NODE_ENV !== "production") {
  // Development → allow everything
  app.use(cors());
} else {
  // Production → only allow whitelisted origins
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS: " + origin));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
}

// ----------------------
// ✅ API Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/me", userRoutes);

// ----------------------
// ✅ Health Check
// ----------------------
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// ----------------------
// ✅ Server
// ----------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
