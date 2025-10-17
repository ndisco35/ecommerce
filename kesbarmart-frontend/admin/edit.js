const API_BASE = "http://localhost:3000/api"; 
const productList= document.getElementById("form-wrap");
const token = localStorage.getItem("token");
// Get query string params (id from URL)
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
//auto fill produvct form
async function loadProduct() {
  try {
    const res = await fetch(`${API_BASE}/products/${postId}`);
    const products = await res.json();

    
    if (!productList) return;

    productList.innerHTML = `
    
    <form id="add-product-form" class="admin-form" enctype="multipart/form-data">
  <h2>Update Product</h2>
  <input type="text" name="name" value="${products.name}" required />
  <input type="number" name="price" value="${products.price}" required />
  <input type="number" name="stock" value="${products.stock}" required />
  <select name="category" required>
    <option value="${products.category}">${products.category}</option>
    <option value="Electronics">Electronics</option>
    <option value="Fashion">Fashion</option>
    <option value="Home">Home</option>
  </select>
  <textarea name="description" placeholder="Description">${products.description}</textarea>
     <p>Current image:</p>
        <img src="${products.product_img}" width="100" />
          <input type="file" name="product_img" accept="image/*"   />
  <button type="submit">Update Product</button>
</form>`;
 const form = document.getElementById("add-product-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    //const token = getToken(); 
    const formData = new FormData(form);

    const res = await fetch(`${API_BASE}/products/update/${postId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Failed to add product");
      return;
    }

    alert("Product updated successfully! you will be redirected to product table");
    window.location.href="admin";
  });
  } catch (err) {
    console.error("Error loading product:", err);
  }
 
}
loadProduct();