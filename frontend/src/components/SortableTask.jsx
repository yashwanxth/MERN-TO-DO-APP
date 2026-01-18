import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { Calendar, CheckCircle, GripVertical } from "lucide-react";

export default function SortableTask({
  task,
  onToggle,
  onRemove,
  onOpen,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  const isOverdue =
    dueDate && isPast(dueDate) && task.status !== "Completed";

  const isDueToday = dueDate && isToday(dueDate);
  const isDueTomorrow = dueDate && isTomorrow(dueDate);

  const statusClass = task.status.replace(" ", "-");

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
      <div className="task-content" onClick={() => onOpen(task)}>
        <div className="task-header">
          <h3
            className={`task-title ${
              task.status === "Completed" ? "completed" : ""
            }`}
          >
            {task.title}
          </h3>

          {task.priority && task.priority !== "Medium" && (
            <span className={`pill priority-${task.priority}`}>
              {task.priority}
            </span>
          )}
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          {dueDate && (
            <span
              className={`task-meta-item ${
                isOverdue
                  ? "overdue"
                  : isDueToday
                  ? "due-today"
                  : ""
              }`}
            >
              <Calendar size={14} />
              {isOverdue && "Overdue · "}
              {isDueToday && "Today"}
              {isDueTomorrow && "Tomorrow"}
              {!isDueToday &&
                !isDueTomorrow &&
                format(dueDate, "MMM d")}
            </span>
          )}

          {task.subtasks?.length > 0 && (
            <span className="task-meta-item">
              <CheckCircle size={14} />
              {
                task.subtasks.filter((s) => s.completed).length
              }
              /{task.subtasks.length}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions">
        <span className={`pill ${statusClass}`}>
          {task.status}
        </span>

        <button
          type="button"
          className="next-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task);
          }}
        >
          {task.status === "Completed" ? "Reset" : "Next"}
        </button>

        <button
          type="button"
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(task._id);
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
