const express = require('express')
const cors = require('cors')
const taskController = require('./controllers/taskController');
const app = express()
const server = require('http').createServer(app);
const port = 3001

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}

require('./sockets/taskSocket')(io);
app.use(cors(corsOptions));

app.get('/', taskController.getTasks);
server.listen(port, () => console.log(`Example app listening on port port!`))