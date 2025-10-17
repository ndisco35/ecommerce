// js/orders.js

//const API_BASE = "http://localhost:3000/api";
const token = localStorage.getItem("token");
const ordersContainer = document.getElementById("orders-container");

if (!token) {
  alert("Please login first!");
  window.location.href = "login";
}

async function loadOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders/myorders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const orders = await res.json();

    ordersContainer.innerHTML = "";

    if (!orders.length) {
      ordersContainer.innerHTML = "<p>You have no orders yet.</p>";
      return;
    }

    orders.forEach((order) => {
      const orderCard = document.createElement("div");
      orderCard.classList.add("order-card");

      const date = new Date(order.createdAt).toLocaleDateString();
      const status = order.status || "Processing";

      orderCard.innerHTML = `
        <div class="order-header">
          <h3>Order #${order._id.slice(-6)}</h3>
          <span>${date}</span>
        </div>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
        <div class="order-items">
          ${order.items
            .map(
              (item) => `
            <div class="order-item">
              <img src="${item.product.product_img || 'https://via.placeholder.com/60'}" alt="${item.product.name}" />
              <div>
                <p>${item.product.name}</p>
                <p>Qty: ${item.quantity}</p>
                <p>Subtotal: $${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;

      ordersContainer.appendChild(orderCard);
    });
  } catch (err) {
    console.error(err);
    ordersContainer.innerHTML = "<p>Error loading orders.</p>";
  }
}

loadOrders();
