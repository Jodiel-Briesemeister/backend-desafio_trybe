const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

const { expect } = chai;
const { MongoClient } = require('mongodb');
const { describe } = require('mocha');
const { getConnection } = require('../connectionMock');
const server = require('../../index');

chai.use(chaiHttp);

describe('/', () => {
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
        {
          task: 'task 3',
          status: 'pronto',
          date: '01-04-2052 01:11:12',
        },
      ]);

      response = await chai.request(server)
        .get('/');
    });

    it('retorna código de status "200"', function () {
      expect(response).to.have.status(200);
    });

    it('as tarefas devem possuir 3 campos corretamente', function () {
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.equal(3);
      expect(response.body[0]).to.have.property('task');
      expect(response.body[0]).to.have.property('status');
      expect(response.body[0]).to.have.property('date');
      expect(response.body[1].task).to.be.equal('task 2');
      expect(response.body[1].date).to.be.equal('01-12-2052 01:11:12');
    });
  });
});