const API_URL = "https://taskboard-2llo.onrender.com/api";
const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

const calendar = document.getElementById("calendar");
const taskList = document.getElementById("task-list");
const agendaList = document.getElementById("agenda-list");
const notesArea = document.getElementById("notes-area");

const modal = document.getElementById("task-modal");
const saveBtn = document.getElementById("save-task-btn");
const deleteBtn = document.getElementById("delete-task-btn");
const closeBtn = document.getElementById("close-modal-btn");
const addTaskBtn = document.getElementById("add-task-btn");
const logoutBtn = document.getElementById("logout-btn");

let selectedDate = new Date();
let selectedTask = null;
let allTasksCache = [];

// --- Calendar Rendering ---
function renderCalendar() {
  calendar.innerHTML = "";
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  document.querySelector(".calendar-section h2").textContent =
    `Calendar — ${selectedDate.toLocaleString("default", { month: "long" })} ${year}`;

  for (let i = 1; i <= daysInMonth; i++) {
    const dayDiv = document.createElement("div");
    const date = new Date(year, month, i);
    dayDiv.textContent = i;
    dayDiv.className = "calendar-day";
    if (date.toDateString() === new Date().toDateString()) dayDiv.classList.add("today");
    dayDiv.addEventListener("click", () => openTaskListForDate(date));
    calendar.appendChild(dayDiv);
  }
}

// --- Fetch Tasks ---
async function loadTasks() {
  const res = await fetch(`${API_URL}/tasks`, { headers });
  const data = await res.json();
  allTasksCache = data;
  return data;
}

// --- Open Tasks for a Date ---
async function openTaskListForDate(date) {
  selectedDate = date;
  const allTasks = await loadTasks();
  const tasks = allTasks.filter(t => new Date(t.date).toDateString() === date.toDateString());
  renderTaskList(tasks);
  renderAgenda(allTasks);
}

// --- Render Task List ---
function renderTaskList(tasks) {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task-bubble";
    div.innerHTML = `
      <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}/>
      <span>${task.title}</span>
      <small>${task.time || ""} (${task.duration || 0}m)</small>
    `;
    div.querySelector(".task-check").addEventListener("change", async () => {
      await fetch(`${API_URL}/tasks/${task._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ completed: !task.completed }),
      });
      openTaskListForDate(selectedDate);
    });
    div.addEventListener("click", () => openTaskModal(task));
    taskList.appendChild(div);
  });
}

// --- Agenda (Week view) ---
function renderAgenda(allTasks) {
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  agendaList.innerHTML = "";
  allTasks
    .filter(t => new Date(t.date) >= startOfWeek && new Date(t.date) <= endOfWeek)
    .forEach(task => {
      const div = document.createElement("div");
      div.className = "agenda-item";
      div.textContent = `${new Date(t.date).toLocaleDateString()}: ${t.title}`;
      agendaList.appendChild(div);
    });
}

// --- Notes Save ---
notesArea.value = localStorage.getItem("notes") || "";
notesArea.addEventListener("input", () => localStorage.setItem("notes", notesArea.value));

// --- Modal Control ---
function openTaskModal(task = null) {
  selectedTask = task;
  document.getElementById("task-title-input").value = task?.title || "";
  document.getElementById("task-desc-input").value = task?.description || "";
  document.getElementById("task-date-input").value = task?.date?.split("T")[0] || selectedDate.toISOString().split("T")[0];
  document.getElementById("task-time-input").value = task?.time || "";
  document.getElementById("task-duration-input").value = task?.duration || "";
  modal.classList.remove("hidden");
}
closeBtn.addEventListener("click", () => (modal.classList.add("hidden")));
addTaskBtn.addEventListener("click", () => openTaskModal());

// --- Save or Update Task ---
saveBtn.addEventListener("click", async () => {
  const task = {
    title: document.getElementById("task-title-input").value,
    description: document.getElementById("task-desc-input").value,
    date: document.getElementById("task-date-input").value,
    time: document.getElementById("task-time-input").value,
    duration: document.getElementById("task-duration-input").value,
  };
  if (selectedTask) {
    await fetch(`${API_URL}/tasks/${selectedTask._id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(task),
    });
  } else {
    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers,
      body: JSON.stringify(task),
    });
  }
  modal.classList.add("hidden");
  openTaskListForDate(selectedDate);
});

// --- Delete Task ---
deleteBtn.addEventListener("click", async () => {
  if (!selectedTask) return;
  await fetch(`${API_URL}/tasks/${selectedTask._id}`, {
    method: "DELETE",
    headers,
  });
  modal.classList.add("hidden");
  openTaskListForDate(selectedDate);
});

// --- Logout ---
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});


// --- Notification Setup ---
async function requestNotificationPermission() {
  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }
}

// --- Browser Notification ---
function checkAndNotifyTasks() {
  const now = new Date();
  allTasksCache.forEach(task => {
    if (!task.time || task.completed) return;
    const taskTime = new Date(`${task.date}T${task.time}`);
    const diff = (taskTime - now) / 1000 / 60; // in minutes
    if (diff > 14 && diff < 16) {
      showInAppNotification(`⏰ ${task.title} starts in 15 minutes!`);
      new Notification("⏰ Task Reminder", {
        body: `${task.title} starts in 15 minutes.`,
        icon: "assets/logo.svg",
      });
    }
  });
}

// --- In-App Toast Notification ---
function showInAppNotification(message) {
  let toast = document.createElement("div");
  toast.className = "inapp-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 5000);
}

// --- Inject Simple Toast Styles ---
const style = document.createElement("style");
style.textContent = `
.inapp-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #222;
  color: #fff;
  padding: 12px 18px;
  border-radius: 8px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease;
  z-index: 9999;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  font-size: 0.9rem;
}
.inapp-toast.show {
  opacity: 1;
  transform: translateY(0);
}`;
document.head.appendChild(style);

// --- Init ---
renderCalendar();
openTaskListForDate(selectedDate);
requestNotificationPermission();

// Check every minute for reminders
setInterval(checkAndNotifyTasks, 60000);
