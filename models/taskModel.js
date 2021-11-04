const { ObjectId } = require('mongodb');
const connection = require('./connection');

const addTask = async ({ task, date, status }) => {
  const db = await connection();
  db.collection('tasks').insertOne({ task, date, status });
};

const getTasks = async () => {
  const db = await connection();
  return db.collection('tasks').find().toArray();
};

const removeTask = async (id) => {
  const db = await connection();
  db.collection('tasks').deleteOne({ _id: ObjectId(id) });
};

const editTask = async ({ task, status, id }) => {
  const db = await connection();
  db.collection('tasks').updateOne({ _id: ObjectId(id) }, { $set: { task, status } });
}

module.exports = {
  addTask,
  getTasks,
  removeTask,
  editTask,
};
