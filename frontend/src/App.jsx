import { useEffect, useState } from "react";
import "./index.css";

const API_URL = "http://localhost:3000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    setError("");
    setAdding(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      setTitle("");
      fetchTasks();
    } catch {
      setError("Failed to add task.");
    } finally {
      setAdding(false);
    }
  };

  const toggleTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "PUT" });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    setDeletingId(id);
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
    setDeletingId(null);
  };

  const filtered = tasks.filter((t) => {
    if (filter === "completed") return t.done === 1;
    if (filter === "pending") return t.done === 0;
    return true;
  });

  const completedCount = tasks.filter((t) => t.done === 1).length;
  const pendingCount = tasks.filter((t) => t.done === 0).length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="app-bg">
      <div className="noise-overlay" />
      <div className="container">

        {/* Header */}
        <header className="header">
          <div className="header-top">
            <div className="logo-mark">✦</div>
            <h1 className="app-title">TaskFlow</h1>
          </div>
          <p className="app-subtitle">Stay focused. Ship things.</p>

          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-num">{tasks.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-card accent">
              <span className="stat-num">{pendingCount}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card green">
              <span className="stat-num">{completedCount}</span>
              <span className="stat-label">Done</span>
            </div>
          </div>

          {/* Progress Bar */}
          {tasks.length > 0 && (
            <div className="progress-wrap">
              <div className="progress-header">
                <span>Progress</span>
                <span className="progress-pct">{progress}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </header>

        {/* Add Task Form */}
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="input-wrap">
            <span className="input-icon">＋</span>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              className={error ? "input-error" : ""}
            />
          </div>
          <button type="submit" className="btn-add" disabled={adding}>
            {adding ? <span className="spinner" /> : "Add Task"}
          </button>
        </form>
        {error && <p className="error-msg">⚠ {error}</p>}

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="filter-badge">
                {f === "all" ? tasks.length : f === "completed" ? completedCount : pendingCount}
              </span>
            </button>
          ))}
        </div>

        {/* Task List */}
        <ul className="task-list">
          {loading ? (
            <li className="empty-state">
              <div className="loading-dots"><span /><span /><span /></div>
              <p>Loading tasks…</p>
            </li>
          ) : filtered.length === 0 ? (
            <li className="empty-state">
              <div className="empty-icon">◎</div>
              <p>{filter === "completed" ? "No completed tasks yet." : filter === "pending" ? "All caught up!" : "No tasks yet. Add one above!"}</p>
            </li>
          ) : (
            filtered.map((task) => (
              <li
                key={task.id}
                className={`task-item ${task.done === 1 ? "done" : ""} ${deletingId === task.id ? "deleting" : ""}`}
              >
                <button
                  className={`check-btn ${task.done === 1 ? "checked" : ""}`}
                  onClick={() => toggleTask(task.id)}
                  aria-label="Toggle task"
                >
                  {task.done === 1 ? "✓" : ""}
                </button>
                <div className="task-body">
                  <span className="task-title">{task.title}</span>
                  {task.created_at && (
                    <span className="task-date">{formatDate(task.created_at)}</span>
                  )}
                </div>
                <div className="task-actions">
                  <button
                    className="btn-toggle"
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.done === 1 ? "Undo" : "Done"}
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteTask(task.id)}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        <footer className="footer">
          Built by Pavithra R
        </footer>
      </div>
    </div>
  );
}

export default App;
