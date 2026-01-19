import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isPast,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./CalendarView.css";

export default function CalendarView({
  currentDate,
  tasks,
  onDateClick,
  onMonthChange,
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const tasksForDay = (day) =>
    tasks.filter(
      (t) => t.dueDate && isSameDay(new Date(t.dueDate), day)
    );

  return (
    <div className="calendar">
      {/* Header */}
      <div className="calendar-header">
        <h2>{format(currentDate, "MMMM yyyy")}</h2>

        <div className="calendar-nav">
          <button
            type="button"
            onClick={() => onMonthChange(subMonths(currentDate, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            className="today-btn"
            onClick={() => onMonthChange(new Date())}
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => onMonthChange(addMonths(currentDate, 1))}
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {weekDays.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const dayTasks = tasksForDay(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const today = isToday(day);

          const hasOverdue = dayTasks.some(
            (t) => isPast(day) && t.status !== "Completed"
          );

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onDateClick(day)}
              className={`calendar-day
                ${today ? "today" : ""}
                ${!isCurrentMonth ? "other-month" : ""}
              `}
            >
              <span>{format(day, "d")}</span>

              {dayTasks.length > 0 && (
                <div className="calendar-day-dots">
                  {dayTasks.slice(0, 3).map((_, i) => (
                    <span
                      key={i}
                      className={`calendar-day-dot ${
                        hasOverdue ? "overdue" : ""
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}