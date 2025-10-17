import multer from "multer";
import path from "path";
import express from "express";
import {protect,admin} from "../middleware/authMiddleware.js";
import { 
  getProducts, 
  getProductById, 
  getProductCategory, 
  searchProductsByName ,
  updateProduct,
  deleteProduct,
  createProduct
} from "../controllers/productController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(process.cwd(), "kesbarmart-frontend/products/"));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Public routes (no protect)
router.get("/", getProducts);                      // Get all products
router.get("/category", getProductCategory);      // Filter by category
router.get("/search", searchProductsByName);  
router.post("/upload", protect,admin,upload.single("product_img"),createProduct); 
router.put("/update/:id",protect,admin,upload.single("product_img"), updateProduct);   // Search products
router.get("/:id", getProductById);       
router.delete("/:id",protect,admin, deleteProduct);
                // Get single product by ID
        // Get single product by ID

export default router;
