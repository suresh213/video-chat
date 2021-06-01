const app = require('express')();
const cors = require('cors');
const server = require('http').createServer(app);
const PORT = process.env.PORT || 5000;
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
var clients = [];
io.on('connection', (socket) => {
  socket.emit('me', socket.id);

  socket.on('calluser', ({ userToCall, from, name, signal, documentId }) => {
    console.log('calling user', documentId);
    socket.join(documentId);
    clients.push(socket.id);
    console.log(clients);
    io.to(userToCall).emit('calluser', { signal, from, name, documentId });
  });

  socket.on('answercall', (data) => {
    console.log('ansering user', data.documentId);
    socket.join(data.documentId);
    clients.push(socket.id);
    console.log(clients);
    io.to(data.to).emit('callaccepted', data.signal);
  });

  socket.on('send-changes', (delta, documentId) => {
    console.log(delta, documentId);
    var clients_in_the_room = io.sockets.adapter.rooms;
    console.log(clients_in_the_room);
    socket.to(documentId).emit('recieve-changes', delta);
  });

  // socket.on('get-document', (documentId) => {
  //   console.log(documentId);
  //   const documentData = documentId;
  //   // socket.join(documentId);
  //   // console.log(documentId);
  //   socket.emit('load-document', documentData);

  //   socket.on('change-name', (name) => {
  //     // console.log(name);
  //     io.to(documentId).emit('recieve-name-change', name);
  //   });
  //   socket.on('send-changes', (delta,documentId) => {
  //     console.log(delta);
  //     io.to(documentId).emit('recieve-changes', delta);
  //   });
  // });
  socket.on('disconnect', () => {
    socket.broadcast.emit('callended');
  });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
