// createAccount.js
const API_URL = "https://taskboard-2llo.onrender.com/api/auth";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createForm");
  const msg = document.getElementById("create-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    try {
      msg.textContent = "Creating account...";
      await register(name, email, password);
      msg.className = "status-msg success";
      msg.textContent = "Account created! Redirecting...";
      setTimeout(()=> window.location.href = "index.html", 900);
    } catch (err) {
      msg.className = "status-msg error";
      msg.textContent = err.message;
    }
  });
});
