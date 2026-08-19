import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:       { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    status:      { type: String, enum: ["todo", "in_progress", "done"], default: "todo" },
    priority:    { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate:     { type: Date, default: null }
  },
  { timestamps: true }
);

// Indexes speed up filtering and sorting queries
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

export default mongoose.model("Task", taskSchema);