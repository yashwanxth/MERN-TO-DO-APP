const taskService = require("../services/task.service");

exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.user.userId, req.body);
    return res.status(201).json(task);
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user.userId, req.query);
    return res.json(tasks);
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.user.userId, req.params.id);
    return res.json(task);
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.user.userId, req.params.id, req.body);
    return res.json(task);
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.user.userId, req.params.id);
    return res.json({ message: "Deleted" });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
};
