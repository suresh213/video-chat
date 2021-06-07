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

  socket.on('updateMyMedia', (data) => {
    io.to(data.userToUpdate).emit('updateUserMedia', data.data);
  });

  socket.on('calluser', ({ userToCall, from, name, signal, documentId }) => {
    io.to(userToCall).emit('calluser', { signal, from, name, documentId });
  });

  socket.on('answercall', (data) => {
    io.to(data.to).emit('updateUserMedia', {
      type: data.type,
      mediaStatus: data.mediaStatus,
    });
    io.to(data.to).emit('callaccepted', data.signal,data.name);
  });

  socket.on('send-changes', (delta, userId) => {
    // console.log(userId)
    io.to(userId).emit('recieve-changes', delta);
  });

  socket.on('send-message', (data) => {
    io.to(data.userToSend).emit('recieve-message', data.data);
  });

  socket.on('callended', (userToUpdate) => {
    io.to(userToUpdate).emit('callended');
  });

  // socket.on('disconnect', () => {
  //   socket.broadcast.emit('callended');
  // });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
