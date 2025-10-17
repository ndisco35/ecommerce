const API_BASE = "https://ecommerce-wjx0.onrender.com/api"; // update if needed
const token = localStorage.getItem("token");
if (!token) {
  alert("Admin access required");
  window.location.href = "../login";
}

const productList= document.getElementById("admin-content");
const productId = document.getElementById("product_id");

// Handle sidebar clicks
document.querySelectorAll(".sidebar li").forEach((li) => {
  li.addEventListener("click", () => {
    const section = li.dataset.section;
    if (section === "products") loadAdminProducts();
    else if (section === "add-product") showAddProductForm();
    else if (section === "orders") showOrders();
  });
});

// ✅ Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "../index";
});
// ===== Fetch and Display Products in a Table =====
async function loadAdminProducts() {
  try {
      productList.innerHTML = "<h2>All Products</h2>";
    const res = await fetch(`${API_BASE}/products`);
    const products = await res.json();

    
    if (!productList) return;

    productList.innerHTML += `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price ($)</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${
            products.length > 0
              ? products
                  .map(
                    (p) => `
              <tr>
                <td><img src="../${p.product_img}" alt="${p.name}" class="product-thumb" style="width:60px;height:50px"></td>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td>${p.category}</td>
                <td>${p.stock}</td>
                <td>${p.description || "—"}</td>
                <td>
                  <a href="/editpro?id=${p._id}" class="btn btn-primary"  style="text-decoration:none">Edit</a>
                  <button class="btn btn-danger" onclick="deleteProduct('${p._id}')">Delete</button>
                </td>
              </tr>`
                  )
                  .join("")
              : `<tr><td colspan="6" style="text-align:center;">No products found</td></tr>`
          }
        </tbody>
      </table>
    `;
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// ===== Delete Product =====
async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("Product deleted successfully!");
      loadAdminProducts(); // refresh table
    } else {
      const data = await res.json();
      alert(data.message || "Error deleting product");
    }
  } catch (err) {
    console.error("Delete error:", err);
  }
}

// ===== Edit Product Placeholder (you can expand later) =====
function editProduct(id) {
  window.Location.href="index";
}

// Load products on page load
document.addEventListener("DOMContentLoaded", loadAdminProducts);

// ✅ Add product form
function showAddProductForm() {
  productList.innerHTML = `
    <h2>Add New Product</h2>
    <form id="add-product-form" class="admin-form" enctype="multipart/form-data">
  <h2>Upload Product</h2>
  <input type="text" name="name" placeholder="Product Name" required />
  <input type="number" name="price" placeholder="Price" required />
  <input type="number" name="stock" placeholder="Stock" required />
  <select name="category" required>
    <option value="">Select Category</option>
    <option value="Electronics">Electronics</option>
    <option value="Fashion">Fashion</option>
    <option value="Home">Home</option>
  </select>
  <textarea name="description" placeholder="Description"></textarea>
  <input type="file" name="product_img" accept="image/*" required />
  <button type="submit" style="background:#2e055f">Upload Product</button>
</form>

<!-- Product List Section -->
<div id="productList"></div>

  `;

  const form = document.getElementById("add-product-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    //const token = getToken(); 
    const formData = new FormData(form);

    const res = await fetch(`${API_BASE}/products/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Failed to add product");
      return;
    }

    alert("Product added successfully!");
    loadAdminProducts();
  });
}

// ✅ Orders section
async function showOrders() {
  productList.innerHTML = "<h2>All Orders</h2>";

  const res = await fetch(`${API_BASE}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const orders = await res.json();


productList.innerHTML +=  `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Items</th>
            <th>Total cost ($)</th>
              <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${
    
            orders.length > 0
              ? orders
                  .map(
                    (o) => `
                    
              <tr>
               
                <td>${o._id}</td>
                <td>${o.items.length}</td>
                <td>${o.totalPrice}</td>

                <td style="color: ${
                        o.status.toLowerCase() === "pending"
                          ? "black"
                          : o.status.toLowerCase() === "approved"
                          ? "yellow"
                          : "gray"
                      }">${o.status}</td>
                <td>
                  <button class="btn btn-primary">View</button>
                </td>
              </tr>`
                  )
                  .join("")
              : `<tr><td colspan="6" style="text-align:center;">No orders yet</td></tr>`
          }
        </tbody>
      </table>
    `;
  if (!orders.length) {
    productList.innerHTML += "<p>No orders yet.</p>";
    return;
  }

}
//loadAdminProducts();
//auto generating product id
