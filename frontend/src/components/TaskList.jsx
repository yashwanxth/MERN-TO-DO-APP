import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete, onOpenTask }) {
  const list = Array.isArray(tasks) ? tasks : [];

  return (
    <div>
      {list.length === 0 && <p style={{ color: "#888" }}>No tasks</p>}

      {list.map((task) => (
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
