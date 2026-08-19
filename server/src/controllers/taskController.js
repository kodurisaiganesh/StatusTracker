import Task from "../models/Task.js";

// GET /api/tasks — list tasks with filters, sorting, pagination
export async function listTasks(req, res) {
  try {
    const page      = Number(req.query.page)      || 1;
    const limit     = Number(req.query.limit)     || 8;
    const status    = req.query.status;
    const priority  = req.query.priority;
    const search    = req.query.search;
    const sortBy    = req.query.sortBy            || "createdAt";
    const sortOrder = req.query.sortOrder         || "desc";

    // Only show the current user's tasks
    const filter = { userId: req.user._id };

    // Apply optional filters
    if (status   && ["todo", "in_progress", "done"].includes(status))   filter.status   = status;
    if (priority && ["low", "medium", "high"].includes(priority))        filter.priority = priority;
    if (search)  filter.title = { $regex: search, $options: "i" };

    // Prevent sorting by arbitrary fields
    const allowed = ["createdAt", "dueDate", "priority", "title"];
    const sortField     = allowed.includes(sortBy) ? sortBy : "createdAt";
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // Fetch tasks
    const skip  = (page - 1) * limit;
    const tasks = await Task.find(filter).sort({ [sortField]: sortDirection }).skip(skip).limit(limit);
    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: tasks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not fetch tasks" });
  }
}

// POST /api/tasks — create a new task
export async function createTask(req, res) {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // Validate required field
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const task = await Task.create({
      userId:      req.user._id,
      title:       title.trim(),
      description: description || "",
      status:      status   || "todo",
      priority:    priority || "medium",
      dueDate:     dueDate  || null
    });

    res.status(201).json({ success: true, data: task });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not create task" });
  }
}

// GET /api/tasks/:id — get a single task
export async function getTask(req, res) {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    res.json({ success: true, data: task });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not fetch task" });
  }
}

// PUT /api/tasks/:id — update all fields of a task
export async function updateTask(req, res) {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, description, status, priority, dueDate: dueDate || null },
      { new: true }
    );

    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    res.json({ success: true, data: task });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not update task" });
  }
}

// PATCH /api/tasks/:id/status
export async function setStatus(req, res) {
  try {
    const { status } = req.body;

    if (!["todo", "in_progress", "done"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be todo, in_progress, or done" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );

    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    res.json({ success: true, data: task });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not update status" });
  }
}

// DELETE /api/tasks/:id 
export async function deleteTask(req, res) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    res.status(204).send();

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not delete task" });
  }
}

// GET /api/tasks/analytics
export async function analytics(req, res) {
  try {
    const total     = await Task.countDocuments({ userId: req.user._id });
    const completed = await Task.countDocuments({ userId: req.user._id, status: "done" });
    const pending   = total - completed;
    const completionPercentage = total === 0 ? 0 : Number(((completed / total) * 100).toFixed(1));

    res.json({ success: true, data: { total, completed, pending, completionPercentage } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not load analytics" });
  }
}