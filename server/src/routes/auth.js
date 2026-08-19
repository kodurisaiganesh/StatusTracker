import { Router } from "express";
import { signup, login } from "../controllers/authController.js";

// Router is like a mini Express app - it groups related routes together
const router = Router();

// POST /api/auth/signup  →  runs the signup function
router.post("/signup", signup);

// POST /api/auth/login   →  runs the login function
router.post("/login", login);

export default router;