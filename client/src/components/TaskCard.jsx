import { HiCheck, HiCalendarDays, HiPencilSquare, HiTrash } from "react-icons/hi2";

const STATUS_LABELS = { todo: "Todo", in_progress: "In Progress", done: "Done" };

export default function TaskCard({ task, onEdit, onDelete, onStatus }) {
  const isDone = task.status === "done";
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isDone;

  return (
    <article className={`task-card prio-${task.priority}${isDone ? " is-done" : ""}`}>
      <div className={`task-check${isDone ? " done" : ""}`}>
        {isDone && <HiCheck style={{ width: 12, height: 12 }} />}
      </div>
      <div className="task-body">
        <div className={`task-title${isDone ? " struck" : ""}`}>
          {task.title}
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
        </div>
        {task.description && <div className="task-desc">{task.description}</div>}
        <div className="task-footer">
          <span className={`badge badge-${task.status}`}>{STATUS_LABELS[task.status]}</span>
          {task.dueDate && (
            <span className={`due-date${isOverdue ? " overdue" : ""}`}>
              <HiCalendarDays style={{ width: 12, height: 12 }} />
              {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              {isOverdue && " · Overdue"}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <select className="status-select" value={task.status} onChange={e => onStatus(task._id, e.target.value)} aria-label="Change status">
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button className="btn btn-secondary btn-sm" onClick={() => onEdit(task)}>
          <HiPencilSquare style={{ width: 13, height: 13 }} /> Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(task._id)}>
          <HiTrash style={{ width: 13, height: 13 }} /> Delete
        </button>
      </div>
    </article>
  );
}