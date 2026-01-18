import { Star, CheckCircle, Calendar } from "lucide-react";

export default function Sidebar({ active, onSelect, taskCounts }) {
  const menuItems = [
    { id: "My Day", icon: Star, count: taskCounts.myDay },
    { id: "Tasks", icon: CheckCircle, count: taskCounts.all },
    { id: "Planned", icon: Calendar, count: taskCounts.planned },
  ];

  return (
    <aside className="sidebar">
      {/* Logo / App Name */}
      <h2 className="logo">Task Manager</h2>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`sidebar-item ${
                active === item.id ? "active" : ""
              }`}
            >
              <div className="sidebar-item-content">
                <Icon size={20} />
                <span>{item.id}</span>
              </div>

              {item.count > 0 && (
                <span className="sidebar-badge">{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
