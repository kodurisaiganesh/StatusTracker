import { useEffect, useState } from "react";
import { HiPencilSquare, HiPlus, HiCheck } from "react-icons/hi2";

const empty = { title: "", description: "", status: "todo", priority: "medium", dueDate: "" };

export default function TaskForm({ initialTask, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialTask ? {
    ...initialTask,
    dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : ""
  } : empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initialTask ? {
      ...initialTask,
      dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : ""
    } : empty);
  }, [initialTask]);

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSubmit({ ...form, dueDate: form.dueDate || null });
      if (!initialTask) setForm(empty);
    } finally { setSaving(false); }
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <h2>
        {initialTask ? <HiPencilSquare /> : <HiPlus />}
        {initialTask ? "Edit Task" : "New Task"}
      </h2>
      <div className="field">
        <label>Title</label>
        <input name="title" value={form.title} onChange={change} placeholder="What needs to be done?" maxLength={150} required />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={change} rows="3" placeholder="Add details (optional)..." />
      </div>
      <div className="form-row">
        <div className="field">
          <label>Status</label>
          <select name="status" value={form.status} onChange={change}>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="field">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={change}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>Due Date</label>
        <input type="date" name="dueDate" value={form.dueDate} onChange={change} />
      </div>
      <div className="form-actions">
        <button className="btn btn-primary btn-full" disabled={saving}>
          {saving ? "Saving..." : <><HiCheck /> {initialTask ? "Save Changes" : "Create Task"}</>}
        </button>
        {initialTask && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}