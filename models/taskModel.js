const { ObjectId } = require('mongodb');
const connect = require('./connection');

const addTask = async ({ task, date, status }) => {
  const db = await connect();
  const { insertedId: id } = await db.collection('tasks').insertOne({ task, date, status });
  return id;
};

const getTasks = async () => {
  const db = await connect();
  const response = await db.collection('tasks').find().toArray();
  return response;
};

const removeTask = async (id) => {
  const db = await connect();
  await db.collection('tasks').deleteOne({ _id: ObjectId(id) });
};

const editTask = async ({ task, status, id }) => {
  const db = await connect();
  await db.collection('tasks').updateOne({ _id: ObjectId(id) }, { $set: { task, status } });
};

module.exports = {
  addTask,
  getTasks,
  removeTask,
  editTask,
};
