export default function Planned({ tasks, onOpenTask }) {
  const grouped = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    const date = new Date(task.dueDate).toDateString();
    acc[date] = acc[date] || [];
    acc[date].push(task);
    return acc;
  }, {});

  return (
    <div>
      {Object.keys(grouped).map(date => (
        <div key={date}>
          <h3>{date}</h3>
          {grouped[date].map(task => (
            <div
              key={task._id}
              style={{ cursor: "pointer", marginBottom: 6 }}
              onClick={() => onOpenTask(task)}
            >
              {task.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
