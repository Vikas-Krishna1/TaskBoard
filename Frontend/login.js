// login.js
const API_BASE = "https://taskboard-2llo.onrender.com/api"; // update if needed

import { loginUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const signupLink = document.getElementById("go-to-signup");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) return alert("Please fill in all fields.");

    loginUser({ email, password });
  });

  signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "createAccount.html";
  });
});
