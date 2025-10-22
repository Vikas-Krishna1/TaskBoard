// script.js — tiny helpers used by dashboard
const API_URL = "https://taskboard-2llo.onrender.com/api/auth";

function escapeHtml(s){
  if(!s) return "";
  return String(s).replace(/[&<>"'\/]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;","/":"&#x2F;"}[ch]));
}
window.escapeHtml = escapeHtml;
