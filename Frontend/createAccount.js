const API_BASE = "https://taskboard-2llo.onrender.com/api/users";

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Signup failed");

    alert("✅ Account created successfully! Please log in.");
    window.location.href = "login.html";
  } catch (err) {
    alert("❌ " + err.message);
    console.error(err);
  }
});
