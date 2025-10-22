// auth.js — Handles Login, Register, and Logout
const API_URL = "https://taskboard-2llo.onrender.com/api/auth";


// Helper to show messages
function showMessage(msg, type = "info") {
  const messageBox = document.getElementById("message");
  messageBox.textContent = msg;
  messageBox.className = type;
}

// LOGIN
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || "Login failed");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    showMessage("✅ Login successful! Redirecting...", "success");

    setTimeout(() => (window.location.href = "index.html"), 1000);
  } catch (err) {
    showMessage("❌ " + err.message, "error");
  }
}

// REGISTER
async function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || "Registration failed");
    }

    showMessage("✅ Account created! Redirecting to login...", "success");
    setTimeout(() => (window.location.href = "login.html"), 1500);
  } catch (err) {
    showMessage("❌ " + err.message, "error");
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// Expose functions globally
window.login = login;
window.register = register;
window.logout = logout;

// ---------- END OF auth.js ----------

