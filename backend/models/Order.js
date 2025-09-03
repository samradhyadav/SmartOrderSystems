import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Preparing", "Out for Delivery", "Delivered"], default: "Pending" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
