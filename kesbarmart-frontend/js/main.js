const API_BASE = "https://ecommerce-wjx0.onrender.com/api"; // update if your API runs elsewhere

// Selectors
const productGrid = document.getElementById("product-grid");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const categoryBtns = document.querySelectorAll(".category-btn");

// ✅ Helper: get token from localStorage
function getToken() {
  return localStorage.getItem("token");
}
const token = getToken();
// ✅ Render product cards
function renderProducts(products) {
  productGrid.innerHTML = ""; // clear old

  if (!products.length) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.product_img}" alt="${product.name}" />
      <div class="info">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button data-id="${product._id}">Add to Cart</button>
      </div>
    `;

    productGrid.appendChild(card);
  });

  // Attach add-to-cart event to buttons
  document.querySelectorAll(".product-card button").forEach((btn) => {
    btn.addEventListener("click", handleAddToCart);
  });
}

// ✅ Fetch all products
async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    renderProducts(data);
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

// ✅ Search products
async function searchProducts(query) {
  try {
    const res = await fetch(`${API_BASE}/products/search?pname=${query}`);
    const data = await res.json();
    renderProducts(data);
  } catch (err) {
    console.error("Error searching products:", err);
  }
}

// ✅ Filter by category
async function filterByCategory(category) {
  try {
    console.log("Fetching category:", category);
    const res = await fetch(`${API_BASE}/products/category?cat=${encodeURIComponent(category)}`);
    const data = await res.json();

    if (!res.ok && data.message) {
      console.error("Category fetch error:", data.message);
      document.getElementById("product-grid").innerHTML = `<p>${data.message}</p>`;
      return;
    }

    renderProducts(data);
  } catch (err) {
    console.error("Error filtering by category:", err);
    document.getElementById("product-grid").innerHTML = `<p>Error fetching category</p>`;
  }
}


// ✅ Add to cart
async function handleAddToCart(e) {
  const productId = e.target.getAttribute("data-id");

  if (!getToken()) {
    alert("You must login first!");
    window.location.href = "login";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/carts/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });

    if (!res.ok) {
      const errData = await res.json();
      alert(errData.message || "Error adding to cart");
      return;
    }

    alert("Product added to cart!");
    CountCartItem();
  } catch (err) {
    console.error("Error adding to cart:", err);
  }
}

// ✅ Event Listeners
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    searchProducts(query);
  } else {
    fetchProducts();
  }
});

categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.getAttribute("data-category");
    filterByCategory(category);
  });
});

// ✅ On page load → fetch all products
fetchProducts();

 //Dynamic item count in cart
async function CountCartItem() {
  const counter = document.getElementById("counter");
 try {
    const res = await fetch(`${API_BASE}/carts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const cart = await res.json();
    const count = cart.items.length;
    counter.textContent= count;
    //cartTotalEl.textContent = total.toFixed(2);
  } catch (err) {
    console.error("Error loading cart:", err);
  }
  }
 // CountCartItem();
