const taskModel = require('../models/taskModel');

const hourDate = () => {
  const date = new Date();
  const dmy = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  const hourMinS = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return `${dmy} ${hourMinS}`;
};

module.exports = (io) => { 
  io.on('connection', (socket) => {

    socket.on('addTask', async (task) => {
      const timestamp = hourDate();
      await taskModel.addTask({ task, date: timestamp, status: "pendente" });
      const tasks = await taskModel.getTasks();
      io.emit('update', tasks);
    })

    socket.on('removeTask', async (id) => {
      await taskModel.removeTask(id);
      const tasks = await taskModel.getTasks();
      io.emit('update', tasks);
    });
  }
)};