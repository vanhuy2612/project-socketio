'use strict' 

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Loads the handlebars module

app.set('view engine', 'ejs');
app.set('views', path.join( __dirname, 'views' ) );
// view engine setup

app.use(express.static('public'))
// Router : 
app.use(require('./routes/index'))

let server = require('http').createServer(app);
/*
  Code socket io --------------------------------------------------------
*/
const io = require('socket.io')(server);

let users = [];
let rooms = [];
function checkNameRoomIsExist(rooms, nameroom){
  let ok = false;
  rooms.forEach(room => {
    if(room.nameroom==nameroom) ok = true;
  });
  return ok;
}
io.on('connection', socket => {
    socket.on('client-login', (data) => {
      let user = data;
      users.push(user);
      io.emit('list-user', users);
    })
    // client join to room
    socket.on('join-room', (data) => {
      socket.join(data.nameroom);
      // check nameroom in rooms
      if(!checkNameRoomIsExist(rooms, data.nameroom)) rooms.push({
        nameroom: data.nameroom,
        users: []
      });
      rooms.forEach(room => {
        if(room.nameroom==data.nameroom) {
          room.users.push(data.sender);
          io.to(data.nameroom).emit('list-user-of-room',room.users);
          console.log(room.users);
        }
          
      });
      
    })
    socket.on('person-to-room', (data) => {
      io.to(data.nameroom).emit("server-send-person-to-room", data);
    })
    socket.on('person-to-all', (data) => {
      io.emit('server-send-person-to-all', (data))
    })
    socket.on('disconnect', () => {
      for(let i=0; i< users.length; i++) {
        if(socket.id == users[i].id) {
          users.splice(i, 1);
          io.emit('list-user', users);
        }
      }
    })
})



/*
  Finish code socket -------------------------------------------------------
*/
server.listen(3000, () => {
    console.log("Server is running at port 3000");
})