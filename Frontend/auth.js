// 🔗 Use your actual Render backend URL below
const API_URL = "https://taskboard-2llo.onrender.com/api/auth";



async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("message");

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
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "index.html";
  } catch (err) {
    msg.textContent = `⚠️ ${err.message}`;
    msg.className = "error";
  }
}

async function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("message");

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

    msg.textContent = "✅ Account created! Redirecting to login...";
    msg.className = "success";
    setTimeout(() => (window.location.href = "login.html"), 1200);
  } catch (err) {
    msg.textContent = `⚠️ ${err.message}`;
    msg.className = "error";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
