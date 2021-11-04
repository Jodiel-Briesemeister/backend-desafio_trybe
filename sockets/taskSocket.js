const taskModel = require('../models/taskModel');

const dateFormat = (date) => {
  return date > 9 ? date : `0${date}`;
};

const hourDate = () => {
  const date = new Date();
  // const dmy = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  const d = dateFormat(date.getDate());
  const m = dateFormat(date.getMonth());
  const y = date.getFullYear();
  // const hourMinS = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const h = dateFormat(date.getHours());
  const mn = dateFormat(date.getMinutes()); 
  const s = dateFormat(date.getSeconds());
  return `${d}-${m}-${y} ${h}:${mn}:${s}`;
};

module.exports = (io) => { 
  io.on('connection', (socket) => {

    const updateTasks = async () => {
      const tasks = await taskModel.getTasks();
      io.emit('update', tasks);
    }

    socket.on('addTask', async (task) => {
      const timestamp = hourDate();
      await taskModel.addTask({ task, date: timestamp, status: "pendente" });
      await updateTasks();
    })

    socket.on('removeTask', async (id) => {
      await taskModel.removeTask(id);
      await updateTasks();
    });

    socket.on('editTask', async ({ task, status, id }) => {
      await taskModel.editTask({ task, status, id});
      await updateTasks();
    })
  }
)};