import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <h2 className="logo">Task Manager</h2>

      <nav className="sidebar-nav">
        <div className="sidebar-item">
          <span>Tasks</span>
        </div>
      </nav>

      <button onClick={toggleTheme} className="theme-toggle">
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </aside>
  );
}
