// ========== DASHBOARD LOGIC ========== //

const calendarEl = document.getElementById("calendar");
const calendarTitle = document.getElementById("calendar-title");
const taskListEl = document.getElementById("task-list");
const agendaEl = document.getElementById("agenda-list");
const modal = document.getElementById("task-modal");
const modalTitle = document.getElementById("modal-title");
const saveTaskBtn = document.getElementById("save-task-btn");
const deleteTaskBtn = document.getElementById("delete-task-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const addTaskBtn = document.getElementById("add-task-btn");
const todayBtn = document.getElementById("today-btn");
const weekBtn = document.getElementById("week-btn");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const notesArea = document.getElementById("notes-area");
const saveNotesBtn = document.getElementById("save-notes-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || {};
let selectedDate = new Date();
let currentMonth = new Date();
let weekView = false;

// ===== STORAGE HELPERS =====
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function saveAllNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// ===== MODAL =====
function openModal(task = null) {
  modal.classList.remove("hidden");
  modal.classList.add("fade-in");
  if (task) {
    modalTitle.textContent = "Edit Task";
    document.getElementById("task-title-input").value = task.title;
    document.getElementById("task-desc-input").value = task.desc;
    document.getElementById("task-date-input").value = task.date;
    saveTaskBtn.dataset.editing = task.id;
  } else {
    modalTitle.textContent = "Add Task";
    document.getElementById("task-title-input").value = "";
    document.getElementById("task-desc-input").value = "";
    document.getElementById("task-date-input").value =
      selectedDate.toISOString().split("T")[0];
    delete saveTaskBtn.dataset.editing;
  }
}
function closeModal() {
  modal.classList.add("fade-out");
  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("fade-in", "fade-out");
  }, 200);
}

// ===== RENDER TASKS =====
function renderTasks() {
  taskListEl.innerHTML = "";
  const dateKey = selectedDate.toISOString().split("T")[0];
  const dayTasks = tasks.filter((t) => t.date === dateKey);

  if (dayTasks.length === 0) {
    taskListEl.innerHTML = "<p class='empty-msg'>No tasks for this day.</p>";
    return;
  }

  dayTasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task-bubble fade-in";
    div.innerHTML = `
      <span>${task.title}</span>
      <div class="task-actions">
        <button class="edit-btn">✏️</button>
        <button class="del-btn">🗑️</button>
      </div>
    `;
    div.querySelector(".edit-btn").onclick = () => openModal(task);
    div.querySelector(".del-btn").onclick = () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
      renderCalendar();
      renderAgenda();
    };
    taskListEl.appendChild(div);
  });
}

// ===== RENDER CALENDAR =====
function renderCalendar() {
  calendarEl.classList.add("fade-in");
  calendarEl.innerHTML = "";
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();

  calendarTitle.textContent = `${currentMonth.toLocaleString("default", {
    month: "long",
  })} ${year}`;

  for (let i = 0; i < startDay; i++) {
    const blank = document.createElement("div");
    blank.className = "calendar-day empty";
    calendarEl.appendChild(blank);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];
    const div = document.createElement("div");
    div.className = "calendar-day";
    div.textContent = day;

    if (date.toDateString() === new Date().toDateString()) {
      div.classList.add("today");
    }
    if (dateStr === selectedDate.toISOString().split("T")[0]) {
      div.classList.add("selected");
    }
    if (tasks.some((t) => t.date === dateStr)) {
      div.classList.add("has-task");
    }

    div.onclick = () => {
      selectedDate = date;
      renderCalendar();
      renderTasks();
      renderNotes();
      renderAgenda();
    };

    calendarEl.appendChild(div);
  }
}

// ===== RENDER AGENDA =====
function renderAgenda() {
  agendaEl.innerHTML = "";
  let filteredTasks = [];

  if (weekView) {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    filteredTasks = tasks.filter((t) => {
      const d = new Date(t.date);
      return d >= startOfWeek && d <= endOfWeek;
    });
  } else {
    const dateKey = selectedDate.toISOString().split("T")[0];
    filteredTasks = tasks.filter((t) => t.date === dateKey);
  }

  if (filteredTasks.length === 0) {
    agendaEl.innerHTML = "<p class='empty-msg'>No tasks in this view.</p>";
    return;
  }

  filteredTasks.forEach((task) => {
    const el = document.createElement("div");
    el.className = "agenda-item fade-in";
    el.innerHTML = `<strong>${task.title}</strong> <small>${task.date}</small>`;
    agendaEl.appendChild(el);
  });
}

// ===== NOTES =====
function renderNotes() {
  const key = selectedDate.toISOString().split("T")[0];
  notesArea.value = notes[key] || "";
}

// ===== EVENTS =====
addTaskBtn.onclick = () => openModal();
closeModalBtn.onclick = closeModal;

saveTaskBtn.onclick = () => {
  const title = document.getElementById("task-title-input").value.trim();
  const desc = document.getElementById("task-desc-input").value.trim();
  const date = document.getElementById("task-date-input").value;
  if (!title || !date) return alert("Please enter title and date.");

  if (saveTaskBtn.dataset.editing) {
    const id = saveTaskBtn.dataset.editing;
    const task = tasks.find((t) => t.id === id);
    task.title = title;
    task.desc = desc;
    task.date = date;
  } else {
    tasks.push({ id: Date.now().toString(), title, desc, date });
  }

  saveTasks();
  closeModal();
  renderTasks();
  renderCalendar();
  renderAgenda();
};

prevMonthBtn.onclick = () => {
  currentMonth.setMonth(currentMonth.getMonth() - 1);
  renderCalendar();
};
nextMonthBtn.onclick = () => {
  currentMonth.setMonth(currentMonth.getMonth() + 1);
  renderCalendar();
};
todayBtn.onclick = () => {
  currentMonth = new Date();
  selectedDate = new Date();
  renderCalendar();
  renderTasks();
  renderAgenda();
  renderNotes();
};
weekBtn.onclick = () => {
  weekView = !weekView;
  weekBtn.classList.toggle("active");
  weekBtn.textContent = weekView ? "Day View" : "Week View";
  renderAgenda();
};
saveNotesBtn.onclick = () => {
  const key = selectedDate.toISOString().split("T")[0];
  notes[key] = notesArea.value;
  saveAllNotes();
  alert("Notes saved!");
};
document.getElementById("logout-btn").onclick = () => {
  localStorage.removeItem("user");
  window.location.href = "login.html";
};

// ===== INITIAL =====
renderCalendar();
renderTasks();
renderAgenda();
renderNotes();
