import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function TaskDetailsDrawer({ task, onClose, onUpdate }) {
  const [form, setForm] = useState(task);

  /* Sync when a new task is opened */
  useEffect(() => {
    setForm(task);
  }, [task]);

  /* Local update + server update */
  const update = (changes) => {
    setForm((prev) => ({ ...prev, ...changes }));
    onUpdate(task._id, changes);
  };

  /* Subtasks */
  const addSubtask = () => {
    const subtasks = [
      ...(form.subtasks || []),
      {
        id: crypto.randomUUID(),
        text: "",
        completed: false,
      },
    ];
    update({ subtasks });
  };

  const updateSubtask = (id, changes) => {
    const subtasks = form.subtasks.map((s) =>
      s.id === id ? { ...s, ...changes } : s
    );
    update({ subtasks });
  };

  const removeSubtask = (id) => {
    const subtasks = form.subtasks.filter((s) => s.id !== id);
    update({ subtasks });
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-header">
          <h3>Task Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="drawer-close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="drawer-content">
          {/* Title */}
          <div className="form-group">
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) =>
                update({ title: e.target.value })
              }
              placeholder="Task title…"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description || ""}
              placeholder="Add description…"
              onChange={(e) =>
                update({ description: e.target.value })
              }
            />
          </div>

          {/* Priority & Status */}
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                value={form.priority || "Medium"}
                onChange={(e) =>
                  update({ priority: e.target.value })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  update({ status: e.target.value })
                }
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={
                form.dueDate
                  ? format(
                      new Date(form.dueDate),
                      "yyyy-MM-dd"
                    )
                  : ""
              }
              onChange={(e) =>
                update({
                  dueDate: e.target.value
                    ? new Date(
                        e.target.value
                      ).toISOString()
                    : null,
                })
              }
            />
          </div>

          {/* Subtasks */}
          <div className="form-group">
            <div className="subtasks-header">
              <label>Subtasks</label>
              <button
                type="button"
                onClick={addSubtask}
                className="add-subtask-btn"
              >
                + Add Subtask
              </button>
            </div>

            <div className="subtasks-list">
              {(form.subtasks || []).map((subtask) => (
                <div
                  key={subtask.id}
                  className="subtask-item"
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={(e) =>
                      updateSubtask(subtask.id, {
                        completed: e.target.checked,
                      })
                    }
                  />

                  <input
                    type="text"
                    value={subtask.text}
                    placeholder="Subtask…"
                    className={
                      subtask.completed
                        ? "completed"
                        : ""
                    }
                    onChange={(e) =>
                      updateSubtask(subtask.id, {
                        text: e.target.value,
                      })
                    }
                  />

                  <button
                    type="button"
                    className="subtask-delete"
                    onClick={() =>
                      removeSubtask(subtask.id)
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* My Day */}
          <div className="checkbox-group">
            <input
              id="myDay"
              type="checkbox"
              checked={form.isMyDay || false}
              onChange={(e) =>
                update({ isMyDay: e.target.checked })
              }
            />
            <label htmlFor="myDay">
              ⭐ Add to My Day
            </label>
          </div>
        </div>
      </aside>
    </div>
  );
}
