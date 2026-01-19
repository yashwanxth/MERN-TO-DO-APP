const taskService = require("../services/task.service");

const handleError = (res, err) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server error"
  });
};

exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.user.userId, req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    handleError(res, err);
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user.userId, req.query);
    res.json({ success: true, data: tasks });
  } catch (err) {
    handleError(res, err);
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.user.userId, req.params.id);
    res.json({ success: true, data: task });
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.user.userId, req.params.id, req.body);
    res.json({ success: true, data: task });
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.user.userId, req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    handleError(res, err);
  }
};
