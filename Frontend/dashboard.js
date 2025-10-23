const API_BASE = "https://taskboard-2llo.onrender.com/api";
let tasks = [];
let selectedDate = new Date();

document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
});

function initDashboard() {
  document.getElementById("add-task-btn").addEventListener("click", openAddModal);
  document.getElementById("close-modal-btn").addEventListener("click", closeModal);
  document.getElementById("save-task-btn").addEventListener("click", saveTask);
  document.getElementById("delete-task-btn").addEventListener("click", deleteTask);
  document.getElementById("logout-btn").addEventListener("click", logout);
  document.getElementById("prev-month").addEventListener("click", () => changeMonth(-1));
  document.getElementById("next-month").addEventListener("click", () => changeMonth(1));

  loadTasks();
  renderCalendar();
  loadNotes();
}

async function loadTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    tasks = await res.json();
    renderTaskList();
    renderAgenda();
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
  }
}

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  calendar.innerHTML = "";

  document.getElementById("calendar-header").textContent =
    `${selectedDate.toLocaleString("default", { month: "long" })} ${year}`;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const el = document.createElement("div");
    el.className = "calendar-day";
    el.textContent = day;

    if (dateStr === new Date().toISOString().split("T")[0]) el.classList.add("today");
    if (tasks.some(t => t.date === dateStr)) el.classList.add("has-task");

    el.addEventListener("click", () => {
      selectedDate = new Date(dateStr);
      renderAgenda();
    });

    calendar.appendChild(el);
  }
}

function changeMonth(offset) {
  selectedDate.setMonth(selectedDate.getMonth() + offset);
  renderCalendar();
  renderAgenda();
}

// Other functions (renderAgenda, saveTask, deleteTask, logout) same as before
