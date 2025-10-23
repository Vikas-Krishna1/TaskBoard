import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "TaskBoard backend running" });
});

// ✅ Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 404 fallback
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
