// js/cart.js

// const API_BASE defined in config.js
const token = getToken();

const cartContainer = document.getElementById("cart-container");
const cartTotalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

// ✅ Redirect if not logged in
if (!token) {
  alert("You must login first");
  window.location.href = "login";
}

// ✅ Fetch and display cart
async function loadCart() {
  try {
    const res = await fetch(`${API_BASE}/carts`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const cart = await res.json();

    if (!cart || !cart.items || cart.items.length === 0) {
      cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
      cartTotalEl.textContent = "0.00";
      checkoutBtn.disabled = true;
      return;
    }

    cartContainer.innerHTML = "";
    let total = 0;

    cart.items.forEach((item) => {
      const product = item.product;
      const price = product.price || 0;
      const subtotal = price * item.quantity;
      total += subtotal;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${product.product_img || 'https://via.placeholder.com/100'}" alt="${product.name}">
        <div class="cart-details">
          <h4>${product.name}</h4>
          <p>Price: $${price.toFixed(2)}</p>
          <p>
            Quantity:
            <input type="number" min="1" value="${item.quantity}" 
              class="qty-input" data-id="${product._id}" />
          </p>
          <p>Subtotal: $${subtotal.toFixed(2)}</p>
        </div>
        <button class="remove-btn" data-id="${product._id}">Remove</button>
      `;
      cartContainer.appendChild(div);
    });

    cartTotalEl.textContent = total.toFixed(2);
  } catch (err) {
    console.error("Error loading cart:", err);
  }
}

// ✅ Remove item from cart
async function removeFromCart(productId) {
  try {
    const res = await fetch(`${API_BASE}/carts/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error removing item");
      return;
    }

    alert("Item removed from cart");
    loadCart();
  } catch (err) {
    console.error("Error removing cart item:", err);
  }
}

// ✅ Update cart quantity
async function updateCartItem(productId, quantity) {
  try {
    const res = await fetch(`${API_BASE}/carts/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error updating item");
      return;
    }

    loadCart();
  } catch (err) {
    console.error("Error updating cart item:", err);
  }
}

// ✅ Checkout
checkoutBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Checkout failed");
      return;
    }

    alert("Order placed successfully!");
    window.location.href = "order.html";
  } catch (err) {
    console.error("Error during checkout:", err);
  }
});

// ✅ Logout handler
document.getElementById("logout").addEventListener("click", () => logout());

// ✅ Event delegation (handles updates and removals dynamically)
cartContainer.addEventListener("input", async (e) => {
  if (e.target.classList.contains("qty-input")) {
    const productId = e.target.dataset.id;
    const newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) return;

    await updateCartItem(productId, newQuantity);
  }
});

cartContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const productId = e.target.dataset.id;
    await removeFromCart(productId);
  }
});

// ✅ Load cart on page load
loadCart();
