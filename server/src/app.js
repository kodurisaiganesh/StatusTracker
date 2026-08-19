import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

// Security headers
app.use(helmet());

// Allow requests from the frontend origin
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));

app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { success: false, message: "Too many attempts, please try again later" }
});

app.use("/api/auth",  authLimiter, authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));

//error handlers
app.use(notFound);
app.use(errorHandler);

export default app;