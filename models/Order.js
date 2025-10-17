import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "shipped", "delivered", "cancelled"], 
    default: "pending" 
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
