const app = require('express')();
const cors = require('cors');
const server = require("http").createServer(app);
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
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
