const TASK_API = "https://taskboard-backend.onrender.com/api/tasks";
const API_URL = "https://taskboard-2llo.onrender.com/api/auth";

async function getTasks() {
  const token = localStorage.getItem("token");
  const res = await fetch(TASK_API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const tasks = await res.json();
  displayTasks(tasks);
}

async function addTask(title, dueDate, time, duration) {
  const token = localStorage.getItem("token");
  const res = await fetch(TASK_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, dueDate, time, duration }),
  });
  if (!res.ok) throw new Error("Failed to add task");
  await getTasks();
}

function displayTasks(tasks) {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = `${t.title} (${t.dueDate})`;
    list.appendChild(li);
  });
}
