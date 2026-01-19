import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function TaskDetailsDrawer({ task, onClose, onUpdate }) {
  const [form, setForm] = useState(task);
  const [saving, setSaving] = useState(false);

  // Sync when a new task is opened
  useEffect(() => {
    setForm(task);
  }, [task]);

  const save = async () => {
    if (!form.title?.trim()) return;

    setSaving(true);

    await onUpdate(task._id, {
      title: form.title.trim(),
      description: form.description || "",
      priority: form.priority || "Medium",
      status: form.status,
      dueDate: form.dueDate || null,
    });

    setSaving(false);
    onClose();
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
                setForm({ ...form, title: e.target.value })
              }
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              placeholder="Add description"
            />
          </div>

          {/* Priority */}
          <div className="form-group">
            <label>Priority</label>
            <select
              value={form.priority || "Medium"}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: e.target.value,
                })
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
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
                setForm({
                  ...form,
                  dueDate: e.target.value
                    ? new Date(
                        e.target.value
                      ).toISOString()
                    : null,
                })
              }
            />
          </div>

          {/* Save */}
          <button
            type="button"
            className="save-btn"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </aside>
    </div>
  );
}
