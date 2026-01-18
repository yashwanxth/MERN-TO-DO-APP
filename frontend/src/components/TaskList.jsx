import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  view,
  onToggle,
  onDelete,
  onOpenTask,
}) {
  let filtered = tasks;

  if (view === "My Day") {
    filtered = tasks.filter(t => t.inMyDay);
  }

  if (view === "Planned") {
    filtered = tasks.filter(t => t.dueDate);
  }

  return (
    <div>
      {filtered.length === 0 && (
        <p style={{ color: "#888" }}>No tasks</p>
      )}

      {filtered.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onOpen={onOpenTask}
        />
      ))}
    </div>
  );
}
