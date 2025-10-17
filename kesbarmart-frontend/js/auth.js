const API_BASE = "http://localhost:3000/api"; // update if needed

// ✅ Save token in localStorage
function saveToken(token) {
  localStorage.setItem("token", token);
}

// ✅ Get token
function getToken() {
  return localStorage.getItem("token");
}

// ✅ Remove token (logout)
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login";
}

// ✅ Handle login form
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }
      // Save token and redirect
      saveToken(data.token);
      if(data.admin==true){
          window.location.href = "admin";
      }
else{
 alert("Login successful!");
      window.location.href = "index";
}
     
    } catch (err) {
      console.error("Error logging in:", err);
    }
  });
}
// ✅ Handle register form
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch(`${API_BASE}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      saveToken(data.token);
      alert("Registration successful!");
      window.location.href = "index";
    } catch (err) {
      console.error("Error registering:", err);
    }
  });
}