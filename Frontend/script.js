// script.js
import { getCurrentUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = getCurrentUser();

  const currentPage = window.location.pathname.split("/").pop();
  if (!currentUser && currentPage === "dashboard.html") {
    window.location.href = "login.html";
  }

  if (currentUser && (currentPage === "login.html" || currentPage === "createAccount.html")) {
    window.location.href = "dashboard.html";
  }
});
