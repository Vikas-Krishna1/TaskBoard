// createAccount.js
import { registerUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("create-form");
  const loginLink = document.getElementById("go-to-login");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) return alert("Please fill all fields.");

    registerUser({ name, email, password });
  });

  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "login.html";
  });
});
