# 🗒️ TaskBoard — Full Stack Productivity Dashboard

**TaskBoard** is a full-stack productivity web app that combines task management, a dynamic calendar, daily notes, and a weekly agenda — all wrapped in a sleek dark "notebook" design.

## 🚀 Live Demo
- **Frontend (Netlify)**: [https://stellar-manatee-39411a.netlify.app](https://stellar-manatee-39411a.netlify.app)
- **Backend (Render)**: [https://taskboard-2llo.onrender.com](https://taskboard-2llo.onrender.com)

---

## ✨ Features
- 🧭 **JWT Authentication** (Register/Login)
- 🗓️ **Interactive Calendar** — Add/edit tasks by date
- ✅ **Task List** — Complete or remove tasks visually
- 📆 **Weekly Agenda** — Real-time view of current week
- 🗒️ **Daily Notes** — Auto-saves locally per user
- 🔔 **Notification Service** (Java microservice-ready)
- 🖤 **Dark Matte Notebook Theme**

---

## 🛠️ Tech Stack
**Frontend:**
- HTML, CSS, JavaScript (Vanilla)
- Deployed via **Netlify**

**Backend:**
- Node.js, Express.js
- MongoDB + Mongoose
- JWT Authentication
- Deployed via **Render**

**Optional Services:**
- Java SpringBoot notification microservice (via `JAVA_SERVICE_URL`)

---

## ⚙️ Environment Setup
Create a `.env` file in your `node-backend` folder:

```bash
MONGO_URI=mongodb+srv://<your_mongo_user>:<your_password>@cluster.mongodb.net/taskboard
PORT=8080
JWT_SECRET=supersecretjwtkey12345
JAVA_SERVICE_URL=http://localhost:8081/notify
