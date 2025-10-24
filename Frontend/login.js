// public/login.js

const API_BASE = "https://taskboard-2llo.onrender.com/api/users";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("⚠️ Please fill in all fields.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    // Save user info (token + name) to localStorage
    localStorage.setItem("user", JSON.stringify(data));

    alert("✅ Login successful!");
    window.location.href = "dashboard.html"; // redirect after success
  } catch (err) {
    alert("❌ " + err.message);
    console.error(err);
  }
});
