/* eslint-disable no-underscore-dangle */
const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

const { expect } = chai;
const { MongoClient } = require('mongodb');
const { describe } = require('mocha');
const { getConnection } = require('../connectionMock');
const taskModels = require('../../models/taskModel');

chai.use(chaiHttp);

describe('testes unitários', () => {
  let connectionMock;

  before(async function () {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });
  after(async function () {
    await MongoClient.connect.restore();
  });

  describe('Quando existem tarefas cadastradas', () => {
    let response;
    before(async function () {
      const tasksCollection = connectionMock.db('taskManager').collection('tasks');
      await tasksCollection.insertMany([
        {
          task: 'task 1',
          status: 'pendente',
          date: '01-02-2052 01:11:12',
        },
        {
          task: 'task 2',
          status: 'em andamento',
          date: '01-12-2052 01:11:12',
        },
      ]);

      response = await taskModels.getTasks();
    });

    it('as tarefas devem possuir 3 campos corretamente', function () {
      expect(response).to.be.an('array');
      expect(response.length).to.be.equal(2);
      expect(response[0]).to.have.property('task');
      expect(response[0]).to.have.property('status');
      expect(response[0]).to.have.property('date');
      expect(response[1].task).to.be.equal('task 2');
      expect(response[1].date).to.be.equal('01-12-2052 01:11:12');
    });
  });

  describe('Quando uma tarefa é removida', () => {
    let response;
    before(async function () {
      const tasks = await taskModels.getTasks();
      await taskModels.removeTask(tasks[0]._id);
      response = await taskModels.getTasks();
    });
    it('deve atualizar o array', function () {
      expect(response).to.be.an('array');
      expect(response.length).to.be.equal(1);
    });
  });

  describe('Quando uma tarefa é editada', () => {
    let response;
    before(async function () {
      const task = await taskModels.getTasks();
      const updatedTask = {
        task: 'task 5',
        status: 'pronto',
        id: task[0]._id,
      };
      await taskModels.editTask(updatedTask);
      response = await taskModels.getTasks();
    });
    it('deve atualizar a tarefa', function () {
      expect(response[0].task).to.be.equal('task 5');
      expect(response[0].status).to.be.equal('pronto');
    });
  });
});