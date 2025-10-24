// auth.js
const API_BASE = "https://taskboard-2llo.onrender.com/api"; // update if needed

export async function registerUser(userData) {
  try {
    const res = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) throw new Error("Registration failed.");
    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("Error: " + err.message);
  }
}

export async function loginUser(credentials) {
  try {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) throw new Error("Invalid credentials.");
    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("Login failed: " + err.message);
  }
}

export function logoutUser() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
