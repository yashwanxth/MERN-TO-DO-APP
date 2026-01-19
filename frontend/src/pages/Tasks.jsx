import { useEffect, useState } from "react";
import api from "../api/client";
import "./Tasks.css";

import Sidebar from "../components/Sidebar";
import SortableTask from "../components/SortableTask";

import { Search, Plus } from "lucide-react";
import { format } from "date-fns";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low"); // ✅ default Low
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (params = {}) => {
    try {
      setLoading(true);
      const res = await api.get("/api/tasks", { params });
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setTasks(data);
    } catch (e) {
      console.error("Load failed", e);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      search.trim() ? load({ search }) : load();
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await api.post("/api/tasks", {
      title: title.trim(),
      priority,
    });

    setTitle("");
    setPriority("Low"); // ✅ reset Low
    load(search ? { search } : {});
  };

  const normalize = (s) => s?.toLowerCase();

  const toggle = async (task) => {
    const s = normalize(task.status);
    const next =
      s === "todo" ? "In Progress" : s === "in progress" ? "Completed" : "Todo";

    await api.put(`/api/tasks/${task._id}`, { status: next });
    load(search ? { search } : {});
  };

  const remove = async (id) => {
    await api.delete(`/api/tasks/${id}`);
    load(search ? { search } : {});
  };

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const completed = safeTasks.filter(
    (t) => t.status?.toLowerCase() === "completed"
  ).length;

  const pending = safeTasks.length - completed;

  if (loading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="tasks-page">
      <Sidebar />

      <main className="tasks-main">
        <header className="tasks-header">
          <div>
            <h1>Tasks</h1>
            <p>{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
          </div>

          <div className="tasks-search">
            <Search size={18} />
            <input
              placeholder="Search tasks"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <section className="tasks-stats">
          <div>Total Tasks: {safeTasks.length}</div>
          <div>Completed: {completed}</div>
          <div>Pending: {pending}</div>
          <div>
            Completion Rate:{" "}
            {safeTasks.length
              ? Math.round((completed / safeTasks.length) * 100)
              : 0}
            %
          </div>
        </section>

        <section className="tasks-layout">
          <aside className="tasks-sidebar-content">
            <form className="task-add" onSubmit={addTask}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a task"
              />

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <button type="submit">
                <Plus size={16} /> Add
              </button>
            </form>
          </aside>

          <section className="tasks-list-content">
            <div className="tasks-list-scroll">
              <div className="tasks-cards">
                {safeTasks.length === 0 && (
                  <p className="muted">No tasks found</p>
                )}

                {safeTasks.map((task) => (
                  <SortableTask
                    key={task._id}
                    task={task}
                    onToggle={toggle}
                    onNext={toggle}
                    onDelete={remove}
                    onRemove={remove}
                    onOpen={() => {}}
                  />
                ))}
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
