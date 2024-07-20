const express = require('express')//express modülünü dahil etti
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)


app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const rooms = { }

app.get('/', (req, res) => {
  res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
  // Send message that new room was created
  io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})
server.listen(3005)

io.on('connection', socket => {
  socket.on('new-user', (room, Name) => {
    socket.join(room);
    rooms[room].users[socket.id] = Name;
    socket.to(room).emit('user-connected', Name);
  });
    socket.on('send-chat-message', (room,message) => {
         socket.to(room).emit('chat-message',{ message: message, Name: rooms[room].users[socket.id] });
    });
    socket.on('disconnect', () => {
      getUserRooms(socket).forEach(room => {
      socket.to(room).emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
    })
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [Name, room]) => {
    if (room.users[socket.id] != null) names.push(Name)
    return names
  }, [])
}