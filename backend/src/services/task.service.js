const Task = require("../models/Task");

async function createTask(userId, payload) {
  const { title, description, priority, status, dueDate } = payload;

  if (!title || !title.trim()) {
    const err = new Error("Title is required");
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
  const { status, priority, search, sortBy = "createdAt", sortOrder = "desc" } = query;

  const filter = { userId };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: "i" };

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

  if (payload.status === "Completed") payload.completedAt = new Date();
  if (payload.status && payload.status !== "Completed") payload.completedAt = null;

  if (payload.title !== undefined) payload.title = String(payload.title).trim();

  const task = await Task.findOneAndUpdate({ _id: taskId, userId }, payload, { new: true });

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

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
