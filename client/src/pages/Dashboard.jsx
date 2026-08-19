import { useEffect, useState } from "react";
import api from "../api.js";
import TaskForm from "../components/TaskForm.jsx";
import TaskCard from "../components/TaskCard.jsx";
import {
  HiClipboardDocumentList,
  HiCheckCircle,
  HiClock,
  HiChartBar,
  HiMagnifyingGlass,
  HiArrowUp,
  HiArrowDown,
  HiInbox,
  HiChevronLeft,
  HiChevronRight
} from "react-icons/hi2";

const initialFilters = { search: "", status: "", priority: "", sortBy: "createdAt", sortOrder: "desc", page: 1, limit: 8 };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState(initialFilters);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([,v]) => v !== ""));
      const [tasksRes, statsRes] = await Promise.all([
        api.get("/tasks", { params }),
        api.get("/tasks/analytics")
      ]);
      setTasks(tasksRes.data.data);
      setPagination(tasksRes.data.pagination);
      setStats(statsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load tasks");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filters]);

  const updateFilter = (name, value) => setFilters(f => ({ ...f, [name]: value, ...(name !== "page" ? { page: 1 } : {}) }));

  const create = async data => { await api.post("/tasks", data); await load(); };
  const update = async data => { await api.put(`/tasks/${editing._id}`, data); setEditing(null); await load(); };
  const remove = async id => { if (confirm("Delete this task?")) { await api.delete(`/tasks/${id}`); await load(); } };
  const status = async (id, value) => { await api.patch(`/tasks/${id}/status`, { status: value }); await load(); };

  const pct = stats?.completionPercentage ?? 0;

  return (
    <div>
      <div className="hero">
        <p className="eyebrow">Dashboard</p>
        <h1>My Tasks</h1>
        <p className="hero-sub">Create, prioritize, and track your work in one place.</p>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-icon blue"><HiClipboardDocumentList /></div>
          <div className="stat-info"><span>Total tasks</span><strong>{stats?.total ?? "—"}</strong></div>
        </div>
        <div className="stat">
          <div className="stat-icon green"><HiCheckCircle /></div>
          <div className="stat-info"><span>Completed</span><strong>{stats?.completed ?? "—"}</strong></div>
        </div>
        <div className="stat">
          <div className="stat-icon amber"><HiClock /></div>
          <div className="stat-info"><span>Pending</span><strong>{stats?.pending ?? "—"}</strong></div>
        </div>
        <div className="stat stat-completion">
          <div className="stat-top">
            <div className="stat-icon violet"><HiChartBar /></div>
            <div className="stat-info"><span>Completion</span><strong>{stats ? `${pct}%` : "—"}</strong></div>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <TaskForm initialTask={editing} onSubmit={editing ? update : create} onCancel={() => setEditing(null)} />

        <section>
          <div className="filters">
            <div className="search-wrap">
              <HiMagnifyingGlass className="search-icon" />
              <input className="search-input" placeholder="Search tasks..." value={filters.search} onChange={e => updateFilter("search", e.target.value)} />
            </div>
            <select className="filter-select" value={filters.status} onChange={e => updateFilter("status", e.target.value)}>
              <option value="">All statuses</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select className="filter-select" value={filters.priority} onChange={e => updateFilter("priority", e.target.value)}>
              <option value="">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select className="filter-select" value={filters.sortBy} onChange={e => updateFilter("sortBy", e.target.value)}>
              <option value="createdAt">Newest</option>
              <option value="dueDate">Due date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
            <button className="sort-btn" onClick={() => updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}>
              {filters.sortOrder === "asc" ? <HiArrowUp /> : <HiArrowDown />}
            </button>
          </div>

          {error && <div className="error-box">{error}</div>}

          {loading ? (
            <div className="loading-box">
              <div className="spinner" />
              <span>Loading your tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-box">
              <HiInbox className="empty-icon" />
              <h3>No tasks found</h3>
              <p>Create your first task using the form on the left.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map(task => (
                <TaskCard key={task._id} task={task} onEdit={setEditing} onDelete={remove} onStatus={status} />
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="pagination">
              <button className="btn btn-secondary btn-sm" disabled={pagination.page <= 1} onClick={() => updateFilter("page", pagination.page - 1)}>
                <HiChevronLeft /> Prev
              </button>
              <span className="page-info">Page {pagination.page} of {pagination.pages}</span>
              <button className="btn btn-secondary btn-sm" disabled={pagination.page >= pagination.pages} onClick={() => updateFilter("page", pagination.page + 1)}>
                Next <HiChevronRight />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}