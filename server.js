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

io.on('connection', (socket) => {
  socket.emit('me', socket.id);

  socket.on('disconnect', () => {
    socket.broadcast.emit('callended');
  });

  socket.on('calluser', ({ userToCall, from, name, signal }) => {
    io.to(userToCall).emit('calluser', { signal, from, name });
  });

  socket.on('answercall', (data) => {
    io.to(data.to).emit('callaccepted', data.signal);
  });
  socket.on('get-document', (documentId) => {
    const documentData = 'hello';
    socket.join(documentId);
    console.log(documentId)
    socket.emit('load-document', documentData);

    socket.on('change-name', (name) => {
      console.log(name);
      socket.broadcast.to(documentId).emit('recieve-name-change', name);
    });
    socket.on('send-changes', (delta) => {
      //   console.log(delta);
      socket.broadcast.to(documentId).emit('recieve-changes', delta);
    });
  });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
