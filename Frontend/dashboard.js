const API_URL = "https://taskboard-2llo.onrender.com/api/auth";
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

// ---------- CALENDAR ----------
function renderCalendar() {
  calendar.innerHTML = "";
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  document.querySelector(".calendar-section h2").textContent =
    `📅 ${selectedDate.toLocaleString("default", { month: "long" })} ${year}`;

  // Pad empty cells before 1st day
  for (let i = 0; i < firstDay.getDay(); i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    calendar.appendChild(empty);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dayDiv = document.createElement("div");
    dayDiv.textContent = i;
    dayDiv.className = "calendar-day";
    if (date.toDateString() === new Date().toDateString()) dayDiv.classList.add("today");

    dayDiv.addEventListener("click", () => openTaskListForDate(date));
    calendar.appendChild(dayDiv);
  }
}

// ---------- FETCH TASKS ----------
async function loadTasks() {
  try {
    const res = await fetch(`${API_URL}/tasks`, { headers });
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return await res.json();
  } catch (err) {
    console.error("Task load error:", err.message);
    return [];
  }
}

// ---------- TASKS FOR DATE ----------
async function openTaskListForDate(date) {
  selectedDate = date;
  const allTasks = await loadTasks();
  const tasks = allTasks.filter(t => new Date(t.date).toDateString() === date.toDateString());
  renderTaskList(tasks);
  renderAgenda(allTasks);
}

// ---------- TASK LIST ----------
function renderTaskList(tasks) {
  taskList.innerHTML = "";
  if (tasks.length === 0) {
    taskList.innerHTML = `<p style="text-align:center;color:#999;">No tasks for this date</p>`;
    return;
  }

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task-bubble";
    div.innerHTML = `
      <label class="task-label">
        <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}/>
        <span class="task-title ${task.completed ? "done" : ""}">${task.title}</span>
      </label>
      <small>${task.time || ""} (${task.duration || 0}m)</small>
    `;

    // Toggle complete
    div.querySelector(".task-check").addEventListener("change", async (e) => {
      e.stopPropagation();
      await fetch(`${API_URL}/tasks/${task._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ completed: !task.completed }),
      });
      openTaskListForDate(selectedDate);
    });

    // Open modal for edit
    div.addEventListener("click", (e) => {
      if (e.target.tagName !== "INPUT") openTaskModal(task);
    });

    taskList.appendChild(div);
  });
}

// ---------- WEEKLY AGENDA ----------
function renderAgenda(allTasks) {
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  agendaList.innerHTML = "";
  allTasks
    .filter(t => new Date(t.date) >= startOfWeek && new Date(t.date) <= endOfWeek)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach(task => {
      const div = document.createElement("div");
      div.className = "agenda-item";
      const dateStr = new Date(task.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
      div.textContent = `${dateStr}: ${task.title}`;
      agendaList.appendChild(div);
    });
}

// ---------- NOTES ----------
notesArea.value = localStorage.getItem("notes") || "";
notesArea.addEventListener("input", () => localStorage.setItem("notes", notesArea.value));

// ---------- MODAL ----------
function openTaskModal(task = null) {
  selectedTask = task;
  document.getElementById("task-title-input").value = task?.title || "";
  document.getElementById("task-desc-input").value = task?.description || "";
  document.getElementById("task-date-input").value = task?.date?.split("T")[0] || selectedDate.toISOString().split("T")[0];
  document.getElementById("task-time-input").value = task?.time || "";
  document.getElementById("task-duration-input").value = task?.duration || "";
  modal.classList.remove("hidden");
}

closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
addTaskBtn.addEventListener("click", () => openTaskModal());

// ---------- SAVE / UPDATE ----------
saveBtn.addEventListener("click", async () => {
  const task = {
    title: document.getElementById("task-title-input").value.trim(),
    description: document.getElementById("task-desc-input").value.trim(),
    date: document.getElementById("task-date-input").value,
    time: document.getElementById("task-time-input").value,
    duration: document.getElementById("task-duration-input").value,
  };
  if (!task.title) return alert("Please enter a task title.");

  try {
    const method = selectedTask ? "PUT" : "POST";
    const url = selectedTask ? `${API_URL}/tasks/${selectedTask._id}` : `${API_URL}/tasks`;
    await fetch(url, { method, headers, body: JSON.stringify(task) });
    modal.classList.add("hidden");
    openTaskListForDate(selectedDate);
  } catch (err) {
    console.error("Save failed:", err.message);
  }
});

// ---------- DELETE ----------
deleteBtn.addEventListener("click", async () => {
  if (!selectedTask) return;
  if (!confirm("Delete this task?")) return;

  try {
    await fetch(`${API_URL}/tasks/${selectedTask._id}`, {
      method: "DELETE",
      headers,
    });
    modal.classList.add("hidden");
    openTaskListForDate(selectedDate);
  } catch (err) {
    console.error("Delete failed:", err.message);
  }
});

// ---------- LOGOUT ----------
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// ---------- INIT ----------
renderCalendar();

openTaskListForDate(selectedDate);