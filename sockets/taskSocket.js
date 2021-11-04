const taskModel = require('../models/taskModel');

const dateFormat = (date) => (date > 9 ? date : `0${date}`);

const hourDate = () => {
  const date = new Date();

  const d = dateFormat(date.getDate());
  const m = dateFormat(date.getMonth());
  const y = date.getFullYear();

  const h = dateFormat(date.getHours());
  const mn = dateFormat(date.getMinutes()); 
  const s = dateFormat(date.getSeconds());

  return `${d}-${m}-${y} ${h}:${mn}:${s}`;
};

const updateTasks = async (io) => {
  const tasks = await taskModel.getTasks();
  io.emit('update', tasks);
};

module.exports = (io) => { 
  io.on('connection', (socket) => {
    socket.on('addTask', async (task) => {
      const timestamp = hourDate();
      await taskModel.addTask({ task, date: timestamp, status: 'pendente' });
      updateTasks(io);
    });

    socket.on('removeTask', async (id) => {
      await taskModel.removeTask(id);
      updateTasks(io);
    });

    socket.on('editTask', async ({ task, status, id }) => {
      await taskModel.editTask({ task, status, id });
      updateTasks(io);
    });
  });
};