// node-backend/routes/userRoutes.js
import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile); // optional for later user dashboard auth

export default router;
