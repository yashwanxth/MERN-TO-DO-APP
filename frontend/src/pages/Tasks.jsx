import { useEffect, useState } from "react";
import api from "../api/client";
import "./Tasks.css";

import Sidebar from "../components/Sidebar";
import TaskDetailsDrawer from "../components/TaskDetailsDrawer";
import CalendarView from "../components/CalendarView";
import SortableTask from "../components/SortableTask";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { motion, AnimatePresence } from "framer-motion";
import { format, isToday } from "date-fns";
import { Search, Plus, Star, Clock, Calendar } from "lucide-react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("Tasks");
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateTaskModal, setShowDateTaskModal] = useState(false);

  const load = async () => {
    try {
      const res = await api.get("/api/tasks");
      setTasks(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e, dueDate = null) => {
    e?.preventDefault();
    if (!title.trim()) return;

    await api.post("/api/tasks", {
      title,
      dueDate: dueDate ? dueDate.toISOString() : null,
      isMyDay: view === "My Day",
    });

    setTitle("");
    setSelectedDate(null);
    setShowDateTaskModal(false);
    load();
  };

  const toggle = async (task) => {
    const next =
      task.status === "Todo"
        ? "In Progress"
        : task.status === "In Progress"
        ? "Completed"
        : "Todo";

    await api.put(`/api/tasks/${task._id}`, { status: next });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/api/tasks/${id}`);
    load();
  };

  const updateTask = async (id, changes) => {
    await api.put(`/api/tasks/${id}`, changes);
    load();
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myDayTasks = filteredTasks.filter(
    (t) => t.isMyDay || (t.dueDate && isToday(new Date(t.dueDate)))
  );

  const plannedTasks = filteredTasks.filter((t) => t.dueDate);

  const taskCounts = {
    myDay: myDayTasks.length,
    all: tasks.length,
    planned: plannedTasks.length,
  };

  if (loading) {
    return <div className="page-loader">Loading...</div>;
  }

  return (
    <div className="tasks-page">
      <Sidebar active={view} onSelect={setView} taskCounts={taskCounts} />

      <main className="tasks-main">
        <header className="tasks-header">
          <div>
            <h1>{view}</h1>
            <p>{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
          </div>

          <div className="tasks-search">
            <Search size={18} />
            <input
              placeholder="Search tasks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {view === "Tasks" && (
          <section className="tasks-layout">
            {/* LEFT COLUMN */}
            <aside className="tasks-left">
              <form className="task-add" onSubmit={add}>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a task"
                />
                <button type="submit">
                  <Plus size={16} /> Add
                </button>
              </form>

              <CalendarView
                currentDate={currentDate}
                tasks={tasks}
                onDateClick={(d) => {
                  setSelectedDate(d);
                  setShowDateTaskModal(true);
                }}
                onMonthChange={setCurrentDate}
              />
            </aside>

            {/* RIGHT COLUMN */}
            <section className="tasks-right">
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={(e) => {
                  const { active, over } = e;
                  if (!over || active.id === over.id) return;

                  setTasks((items) => {
                    const oldIndex = items.findIndex(
                      (i) => i._id === active.id
                    );
                    const newIndex = items.findIndex(
                      (i) => i._id === over.id
                    );
                    return arrayMove(items, oldIndex, newIndex);
                  });
                }}
              >
                <SortableContext
                  items={filteredTasks.map((t) => t._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <AnimatePresence>
                    {filteredTasks.map((task) => (
                      <SortableTask
                        key={task._id}
                        task={task}
                        onToggle={toggle}
                        onRemove={remove}
                        onOpen={setSelectedTask}
                        viewMode={view}
                      />
                    ))}
                  </AnimatePresence>
                </SortableContext>
              </DndContext>
            </section>
          </section>
        )}

        {view === "My Day" &&
          myDayTasks.map((task) => (
            <SortableTask
              key={task._id}
              task={task}
              onToggle={toggle}
              onRemove={remove}
              onOpen={setSelectedTask}
              viewMode={view}
            />
          ))}

        {view === "Planned" &&
          plannedTasks.map((task) => (
            <SortableTask
              key={task._id}
              task={task}
              onToggle={toggle}
              onRemove={remove}
              onOpen={setSelectedTask}
              viewMode={view}
            />
          ))}
      </main>

      {selectedTask && (
        <TaskDetailsDrawer
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
        />
      )}

      {showDateTaskModal && selectedDate && (
        <div className="modal-backdrop" onClick={() => setShowDateTaskModal(false)}>
          <motion.div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Add task for {format(selectedDate, "MMM d")}</h3>
            <form onSubmit={(e) => add(e, selectedDate)}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              <button type="submit">Add</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
