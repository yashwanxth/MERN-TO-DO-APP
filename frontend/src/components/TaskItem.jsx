export default function TaskItem({ task, onOpen, onToggle }) {
  return (
    <div className="task-row">
      <input
        type="checkbox"
        checked={task.status === "Completed"}
        onChange={() => onToggle(task)}
      />

      <span
        className={task.status === "Completed" ? "done" : ""}
        onClick={() => onOpen(task)}
      >
        {task.title}
      </span>

      <span className={`star ${task.important ? "on" : ""}`}>
        ★
      </span>
    </div>
  );
}
