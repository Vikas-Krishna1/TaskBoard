import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// connect to Mongo
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// error handlers
app.use(notFound);
app.use(errorHandler);

// start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
