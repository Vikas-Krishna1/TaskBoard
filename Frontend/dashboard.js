// dashboard.js — Phase 3C (Interactive + Animated)

const API_BASE = "https://your-backend-url.onrender.com/api";
let tasks = [];
let selectedDate = new Date().toISOString().split("T")[0];

document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
});

function initDashboard() {
  document.getElementById("add-task-btn").addEventListener("click", openAddModal);
  document.getElementById("close-modal-btn").addEventListener("click", closeModal);
  document.getElementById("save-task-btn").addEventListener("click", saveTask);
  document.getElementById("delete-task-btn").addEventListener("click", deleteTask);
  document.getElementById("logout-btn").addEventListener("click", logout);

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

function renderTaskList() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = `<p class="empty-msg">No tasks yet.</p>`;
    return;
  }

  tasks.forEach(task => {
    const taskEl = document.createElement("div");
    taskEl.className = `task-bubble ${task.completed ? "completed" : ""}`;
    taskEl.innerHTML = `
      <div class="bubble-top">
        <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""} data-id="${task._id}" />
        <span class="task-title">${task.title}</span>
      </div>
      <div class="bubble-bottom">
        <small>${task.date || "No date"} ${task.time || ""}</small>
      </div>
    `;

    // Smooth animation
    taskEl.style.opacity = 0;
    list.appendChild(taskEl);
    setTimeout(() => (taskEl.style.opacity = 1), 50);

    // Add listeners
    taskEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("task-check")) return;
      openEditModal(task);
    });

    taskEl.querySelector(".task-check").addEventListener("change", (e) => toggleTaskCompletion(task._id, e.target.checked));
  });
}

async function toggleTaskCompletion(id, done) {
  try {
    await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: done }),
    });
    tasks = tasks.map(t => (t._id === id ? { ...t, completed: done } : t));
    renderTaskList();
    renderAgenda();
  } catch (err) {
    console.error("Error toggling completion:", err);
  }
}

function renderAgenda() {
  const agenda = document.getElementById("agenda-list");
  agenda.innerHTML = "";

  const dayTasks = tasks.filter(t => t.date === selectedDate);
  if (dayTasks.length === 0) {
    agenda.innerHTML = `<p class="empty-msg">No tasks for this day.</p>`;
    return;
  }

  dayTasks.forEach(t => {
    const el = document.createElement("div");
    el.className = "agenda-item";
    el.innerHTML = `
      <span class="${t.completed ? "done" : ""}">${t.title}</span>
      <small>${t.time || ""}</small>
    `;
    agenda.appendChild(el);
  });
}

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= days; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const el = document.createElement("div");
    el.className = "calendar-day";
    if (dateStr === selectedDate) el.classList.add("selected");
    if (dateStr === now.toISOString().split("T")[0]) el.classList.add("today");

    const hasTask = tasks.some(t => t.date === dateStr);
    if (hasTask) el.classList.add("has-task");

    el.textContent = day;
    el.addEventListener("click", () => {
      selectedDate = dateStr;
      renderCalendar();
      renderAgenda();
    });

    calendar.appendChild(el);
  }
}

function openAddModal() {
  const modal = document.getElementById("task-modal");
  modal.classList.remove("hidden");
  modal.dataset.mode = "add";
  document.getElementById("modal-title").textContent = "Add Task";
  clearModalInputs();
}

function openEditModal(task) {
  const modal = document.getElementById("task-modal");
  modal.classList.remove("hidden");
  modal.dataset.mode = "edit";
  modal.dataset.id = task._id;

  document.getElementById("modal-title").textContent = "Edit Task";
  document.getElementById("task-title-input").value = task.title;
  document.getElementById("task-desc-input").value = task.description || "";
  document.getElementById("task-date-input").value = task.date || "";
  document.getElementById("task-time-input").value = task.time || "";
  document.getElementById("task-duration-input").value = task.duration || "";
}

function closeModal() {
  document.getElementById("task-modal").classList.add("hidden");
}

function clearModalInputs() {
  ["task-title-input", "task-desc-input", "task-date-input", "task-time-input", "task-duration-input"].forEach(id => {
    document.getElementById(id).value = "";
  });
}

async function saveTask() {
  const title = document.getElementById("task-title-input").value.trim();
  if (!title) return alert("Please enter a task title.");

  const data = {
    title,
    description: document.getElementById("task-desc-input").value,
    date: document.getElementById("task-date-input").value,
    time: document.getElementById("task-time-input").value,
    duration: document.getElementById("task-duration-input").value,
  };

  const modal = document.getElementById("task-modal");
  const isEdit = modal.dataset.mode === "edit";
  const method = isEdit ? "PUT" : "POST";
  const url = isEdit ? `${API_BASE}/tasks/${modal.dataset.id}` : `${API_BASE}/tasks`;

  try {
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    closeModal();
    loadTasks();
  } catch (err) {
    console.error("Failed to save:", err);
  }
}

async function deleteTask() {
  const modal = document.getElementById("task-modal");
  const id = modal.dataset.id;
  if (!id || !confirm("Delete this task?")) return;

  try {
    await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    closeModal();
    loadTasks();
  } catch (err) {
    console.error("Failed to delete:", err);
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function loadNotes() {
  const notesArea = document.getElementById("notes-area");
  notesArea.value = localStorage.getItem("dailyNotes") || "";
  notesArea.addEventListener("input", () => {
    localStorage.setItem("dailyNotes", notesArea.value);
  });
}
