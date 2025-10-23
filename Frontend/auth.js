const API_URL = "https://taskboard-2llo.onrender.com/api";

// ==== ELEMENTS ====
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const messageBox = document.getElementById("message");

// ==== HELPERS ====
function showMessage(text, type = "info") {
  messageBox.textContent = text;
  messageBox.className = `msg ${type}`;
  setTimeout(() => (messageBox.textContent = ""), 4000);
}

// ==== LOGIN ====
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      showMessage("Login successful! Redirecting...", "success");
      setTimeout(() => (window.location.href = "dashboard.html"), 1000);
    } catch (err) {
      showMessage(err.message, "error");
    }
  });
}

// ==== SIGNUP ====
if (signupForm) {
  signupForm.addEventListener("submit", async e => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      showMessage("Account created! Redirecting to login...", "success");
      setTimeout(() => (window.location.href = "login.html"), 1200);
    } catch (err) {
      showMessage(err.message, "error");
    }
  });
}
