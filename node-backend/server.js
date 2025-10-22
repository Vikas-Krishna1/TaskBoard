import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ✅ CORS fix
const allowedOrigins = [
  "https://taskboard-ui.netlify.app", // your frontend URL
  "http://localhost:5500",            // for local testing
];
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500", // local dev (Live Server)
      "http://localhost:5500",
      "https://stellar-manatee-39411a.netlify.app", // your Netlify front-end
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
