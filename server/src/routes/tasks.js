import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listTasks,
  createTask,
  getTask,
  updateTask,
  setStatus,
  deleteTask,
  analytics
} from "../controllers/taskController.js";

const router = Router();

// Apply requireAuth to every route in this file.
// This means every task endpoint requires a valid JWT token.
router.use(requireAuth);

// IMPORTANT: /analytics must be registered BEFORE /:id
// Otherwise Express would treat the word "analytics" as an id parameter
router.get("/analytics", analytics);       // GET /api/tasks/analytics

router.get("/",          listTasks);        // GET /api/tasks
router.post("/",         createTask);       // POST /api/tasks
router.get("/:id",       getTask);          // GET /api/tasks/:id
router.put("/:id",       updateTask);       // PUT /api/tasks/:id
router.patch("/:id/status", setStatus);    // PATCH /api/tasks/:id/status
router.delete("/:id",    deleteTask);       // DELETE /api/tasks/:id

export default router;