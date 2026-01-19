import { isToday } from "date-fns";

export default function MyDay({ tasks }) {
  return (
    <>
      <h1>My Day</h1>
      {tasks
        .filter((t) => t.dueDate && isToday(new Date(t.dueDate)))
        .map((t) => (
          <div key={t._id}>{t.title}</div>
        ))}
    </>
  );
}
