const API_URL = "https://taskboard-2llo.onrender.com/api"; // your backend base
const form = document.getElementById("register-form");
const message = document.getElementById("register-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "Creating account…";
  message.style.color = "var(--text-muted)";

  const user = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim(),
  };

  try {
    const res = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Registration failed");

    message.textContent = "✅ Account created successfully! Redirecting…";
    message.style.color = "lightgreen";

    setTimeout(() => (window.location.href = "login.html"), 2000);
  } catch (err) {
    message.textContent = `❌ ${err.message}`;
    message.style.color = "salmon";
  }
});
