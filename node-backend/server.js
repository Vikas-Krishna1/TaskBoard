import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true })); // match your Live Server origin
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// app.listen(8080, () => console.log("✅ Server running on port 8080"));
