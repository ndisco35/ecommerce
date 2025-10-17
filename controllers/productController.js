import Product from "../models/Product.js";

// @desc Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create product (Admin)
export const createProduct = async (req, res) => {
  try {
    const { name,description,category, stock,price } = req.body;

    if (!req.file) return res.status(400).json({ message: "Product image is required" });

    const product = new Product({
      name,
      description,
      category,
      stock,
      price,
      product_img: `/products/${req.file.filename}`, // store path relative to frontend
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update product (Admin)


// ✅ Update product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If a file is uploaded, update the image path
    if (req.file) {
      product.product_img = `products/${req.file.filename}`;
    }

    // Update text fields from form data (multer handles formData)
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.description = req.body.description || product.description;
    product.stock = req.body.stock || product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// @desc Delete product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product_id= req.params.id
    const product = await Product.findOneAndDelete({_id:product_id});
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//search product my category
export const getProductCategory = async (req, res) => {
  try {
    const category = req.query.cat;
    //const product = await Product.find({category:category});
    
    const product = await Product.find({ category: { $regex: new RegExp(category, "i") } });

    if (!product) return res.status(404).json({ message: "Invalid seach not matching category"});
    if(product.length===0){
      res.json({ message: "Product not yet added to "+ category + " category"});
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//search product my name
export const searchProductsByName = async (req, res) => {
  const searchTerm = req.query.pname; // e.g. /api/products/search?q=infinix

  if (!searchTerm) {
    return res.status(400).json({ error: 'Search query  is required' });
  }

  try {
    const products = await Product.find({
      name: { $regex: searchTerm, $options: 'i' } // case-insensitive partial match
    });
if(products.length===0){
      res.json({ message: " No Product matches your search request"});
    }
    res.status(200).json(products);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Server error during product search' });
  }
};
