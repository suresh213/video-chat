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

  socket.on('updateMyMedia', (data) => {
    console.log(data);
    io.to(data.userToUpdate).emit('updateUserMedia', data.data);
  });

  socket.on('calluser', ({ userToCall, from, name, signal, documentId }) => {
    io.to(userToCall).emit('calluser', { signal, from, name, documentId });
  });

  socket.on('answercall', (data) => {
    socket.join(data.documentId);
    console.log(data);
    io.to(data.to).emit('updateUserMedia', {
      type: data.type,
      mediaStatus: data.mediaStatus,
    });
    io.to(data.to).emit('callaccepted', data.signal);
  });

  socket.on('send-changes', (delta, documentId) => {
    console.log(documentId)
    io.to(documentId).emit('recieve-changes', delta);
  });

  socket.on('send-message',data=>{
    io.to(data.userToSend).emit('recieve-message',data.data)
  })

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
  // clients = [];
  console.log(`Server is running at port ${PORT}`);
});
