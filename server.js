import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();




const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Atlas "))
.catch(err => console.log(err));
// ✅ Serve static frontend files
const frontendPath = path.join(__dirname, "./kesbarmart-frontend");
app.use(express.static(frontendPath));

// ✅ Default route → serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
app.get("/index", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
app.get("/admin", (req, res) => {
  res.sendFile(path.join(frontendPath, "./admin/admin.html"));
});
// ✅ Optional: Handle direct navigation to pages (like /login.html)
app.get("/login", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(frontendPath, "register.html"));
});

app.get("/cart", (req, res) => {
  res.sendFile(path.join(frontendPath, "cart.html"));
});

app.get("/order.html", (req, res) => {
  res.sendFile(path.join(frontendPath, "order.html"));
});

app.get("/editpro", (req, res) => {
  res.sendFile(path.join(frontendPath, "./admin/editpro.html"));
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
