import mongoose from "mongoose";
// Define schema for user
const productSchema = new mongoose.Schema({ 
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true, unique: true },
  category: { type: String, required: true }, 
  stock: { type: Number, required: true, default:1 }, 
  price: { type: Number, required: true }, 
 product_img: { type: String, required: true},
}, { timestamps: true });
export default mongoose.model("Product", productSchema);