export default function MyDay({ tasks }) {
  return (
    <>
      <h1>My Day</h1>
      {tasks.filter(t => t.inMyDay).map(t => (
        <div key={t._id}>{t.title}</div>
      ))}
    </>
  );
}
