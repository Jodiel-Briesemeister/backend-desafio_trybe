const taskModel = require('../models/taskModel');

const getTasks = async (_req, res) => {
  const tasks = await taskModel.getTasks();
  res.status(200).json(tasks);
}

module.exports = {
  getTasks,
}