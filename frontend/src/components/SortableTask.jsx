import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { Calendar, GripVertical } from "lucide-react";

export default function SortableTask({
  task,
  onToggle,
  onRemove,
  onOpen,

  // new (backward compatible)
  onNext,
  onDelete,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  const isOverdue = dueDate && isPast(dueDate) && task.status !== "Completed";
  const isDueToday = dueDate && isToday(dueDate);
  const isDueTomorrow = dueDate && isTomorrow(dueDate);

  const statusClass = (task.status || "Todo").replaceAll(" ", "-").toLowerCase();
  const pr = (task.priority || "Medium").toLowerCase();

  const handleNext = (e) => {
    e.stopPropagation();
    if (onNext) return onNext(task);
    if (onToggle) return onToggle(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) return onDelete(task._id);
    if (onRemove) return onRemove(task._id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${isOverdue ? "overdue" : ""}`}
    >
      {/* Drag handle */}
      <div
        className="task-drag"
        {...attributes}
        {...listeners}
        aria-label="Drag task"
      >
        <GripVertical size={18} />
      </div>

      {/* Content */}
      <div className="task-content" onClick={() => onOpen && onOpen(task)}>
        <div className="task-header">
          <h3
            className={`task-title ${
              task.status === "Completed" ? "completed" : ""
            }`}
            title={task.title}
          >
            {task.title}
          </h3>

          {/* ✅ Always show priority */}
          <span className={`pill priority ${pr}`}>{(task.priority || "Medium").toUpperCase()}</span>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          {dueDate && (
            <span
              className={`task-meta-item ${
                isOverdue ? "overdue" : isDueToday ? "due-today" : ""
              }`}
            >
              <Calendar size={14} />
              {isOverdue && "Overdue · "}
              {isDueToday && "Today"}
              {isDueTomorrow && "Tomorrow"}
              {!isDueToday && !isDueTomorrow && format(dueDate, "MMM d")}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions">
        <span className={`pill status ${statusClass}`}>
          {(task.status || "Todo").toUpperCase()}
        </span>

        <button type="button" className="next-btn" onClick={handleNext}>
          {task.status === "Completed" ? "Reset" : "Next"}
        </button>

        <button type="button" className="delete-btn" onClick={handleDelete}>
          ✕
        </button>
      </div>
    </div>
  );
}
