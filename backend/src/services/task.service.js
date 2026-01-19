const Task = require("../models/Task");

const ALLOWED_STATUS = ["Todo", "In Progress", "Completed"];
const ALLOWED_PRIORITY = ["Low", "Medium", "High"];
const ALLOWED_SORT_FIELDS = ["createdAt", "dueDate", "priority"];

async function createTask(userId, payload) {
  const { title, description, priority, status, dueDate } = payload;

  if (!title || !title.trim()) {
    const err = new Error("Title is required");
    err.statusCode = 400;
    throw err;
  }

  if (priority && !ALLOWED_PRIORITY.includes(priority)) {
    const err = new Error("Invalid priority");
    err.statusCode = 400;
    throw err;
  }

  if (status && !ALLOWED_STATUS.includes(status)) {
    const err = new Error("Invalid status");
    err.statusCode = 400;
    throw err;
  }

  return Task.create({
    userId,
    title: title.trim(),
    description: description || "",
    priority: priority || "Medium",
    status: status || "Todo",
    dueDate: dueDate ? new Date(dueDate) : null
  });
}

async function getTasks(userId, query) {
  const {
    status,
    priority,
    search,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;

  const filter = { userId };

  if (status) {
    if (!ALLOWED_STATUS.includes(status)) {
      const err = new Error("Invalid status filter");
      err.statusCode = 400;
      throw err;
    }
    filter.status = status;
  }

  if (priority) {
    if (!ALLOWED_PRIORITY.includes(priority)) {
      const err = new Error("Invalid priority filter");
      err.statusCode = 400;
      throw err;
    }
    filter.priority = priority;
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  /**
   * ✅ PRIORITY SORT
   * Always: High → Medium → Low
   * Independent of sortOrder
   */
  if (sortBy === "priority") {
    return Task.aggregate([
      { $match: filter },
      {
        $addFields: {
          priorityRank: {
            $switch: {
              branches: [
                { case: { $eq: ["$priority", "High"] }, then: 1 },
                { case: { $eq: ["$priority", "Medium"] }, then: 2 },
                { case: { $eq: ["$priority", "Low"] }, then: 3 }
              ],
              default: 2
            }
          }
        }
      },
      { $sort: { priorityRank: 1 } }
    ]);
  }

  if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
    const err = new Error("Invalid sort field");
    err.statusCode = 400;
    throw err;
  }

  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  return Task.find(filter).sort(sort);
}

async function getTaskById(userId, taskId) {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    const err = new Error("Task not found");
    err.statusCode = 404;
    throw err;
  }
  return task;
}

async function updateTask(userId, taskId, updates) {
  const payload = { ...updates };

  if (payload.priority && !ALLOWED_PRIORITY.includes(payload.priority)) {
    const err = new Error("Invalid priority");
    err.statusCode = 400;
    throw err;
  }

  if (payload.status && !ALLOWED_STATUS.includes(payload.status)) {
    const err = new Error("Invalid status");
    err.statusCode = 400;
    throw err;
  }

  if (payload.status === "Completed") {
    payload.completedAt = new Date();
  }

  if (payload.status && payload.status !== "Completed") {
    payload.completedAt = null;
  }

  if (payload.title !== undefined) {
    payload.title = String(payload.title).trim();
    if (!payload.title) {
      const err = new Error("Title cannot be empty");
      err.statusCode = 400;
      throw err;
    }
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    payload,
    { new: true }
  );

  if (!task) {
    const err = new Error("Task not found");
    err.statusCode = 404;
    throw err;
  }

  return task;
}

async function deleteTask(userId, taskId) {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });
  if (!task) {
    const err = new Error("Task not found");
    err.statusCode = 404;
    throw err;
  }
  return true;
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
