import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: "General" },
    image: { type: String, default: "" },
    available: { type: Boolean, default: true },
    createdAt: {type: Date, default: Date.now,}
  },
  { timestamps: true }
);

export default mongoose.model("Menu", menuSchema);
