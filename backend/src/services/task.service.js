const Task = require("../models/Task");
const mongoose = require("mongoose");

const ALLOWED_STATUS = ["Todo", "In Progress", "Completed"];
const ALLOWED_PRIORITY = ["Low", "Medium", "High"];
const ALLOWED_SORT_FIELDS = ["createdAt", "dueDate", "priority"];

async function createTask(userId, payload) {
  const { title, description, priority, status, dueDate } = payload;

  if (!title || !title.trim()) {
    throw Object.assign(new Error("Title is required"), { statusCode: 400 });
  }

  if (priority && !ALLOWED_PRIORITY.includes(priority)) {
    throw Object.assign(new Error("Invalid priority"), { statusCode: 400 });
  }

  if (status && !ALLOWED_STATUS.includes(status)) {
    throw Object.assign(new Error("Invalid status"), { statusCode: 400 });
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
    sortOrder = "desc",
    page = 1,
    limit = 20
  } = query;

  const filter = { userId };

  if (status) {
    if (!ALLOWED_STATUS.includes(status)) {
      throw Object.assign(new Error("Invalid status filter"), { statusCode: 400 });
    }
    filter.status = status;
  }

  if (priority) {
    if (!ALLOWED_PRIORITY.includes(priority)) {
      throw Object.assign(new Error("Invalid priority filter"), { statusCode: 400 });
    }
    filter.priority = priority;
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const skip = (Math.max(page, 1) - 1) * Math.min(limit, 100);

  // Priority: High → Medium → Low (always)
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
      { $sort: { priorityRank: 1 } },
      { $skip: skip },
      { $limit: Math.min(limit, 100) }
    ]);
  }

  if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
    throw Object.assign(new Error("Invalid sort field"), { statusCode: 400 });
  }

  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  return Task.find(filter).sort(sort).skip(skip).limit(Math.min(limit, 100));
}

async function getTaskById(userId, taskId) {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw Object.assign(new Error("Invalid task id"), { statusCode: 400 });
  }

  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    throw Object.assign(new Error("Task not found"), { statusCode: 404 });
  }
  return task;
}

async function updateTask(userId, taskId, updates) {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw Object.assign(new Error("Invalid task id"), { statusCode: 400 });
  }

  if (updates.priority && !ALLOWED_PRIORITY.includes(updates.priority)) {
    throw Object.assign(new Error("Invalid priority"), { statusCode: 400 });
  }

  if (updates.status && !ALLOWED_STATUS.includes(updates.status)) {
    throw Object.assign(new Error("Invalid status"), { statusCode: 400 });
  }

  if (updates.status === "Completed") updates.completedAt = new Date();
  if (updates.status && updates.status !== "Completed") updates.completedAt = null;

  if (updates.title !== undefined) {
    updates.title = String(updates.title).trim();
    if (!updates.title) {
      throw Object.assign(new Error("Title cannot be empty"), { statusCode: 400 });
    }
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    updates,
    { new: true }
  );

  if (!task) {
    throw Object.assign(new Error("Task not found"), { statusCode: 404 });
  }

  return task;
}

async function deleteTask(userId, taskId) {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw Object.assign(new Error("Invalid task id"), { statusCode: 400 });
  }

  const task = await Task.findOneAndDelete({ _id: taskId, userId });
  if (!task) {
    throw Object.assign(new Error("Task not found"), { statusCode: 404 });
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
