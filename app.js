var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var moment = require('moment');

var usersOnline = [];

app.use(express.static(__dirname + '/public/'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

function sendStats(){
  for(var i in io.sockets.connected){
    var sock = io.sockets.connected[i];
    sock.emit("stats", {users: usersOnline});
  }
}

io.on('connection', function(socket) {
  socket.emit('announcements', { message: 'Usuario novo!'});

  socket.on("login", function(data){
    if(usersOnline.includes(data.name)){
      socket.emit('error', { type: "login", message: "Nome de usuário já existe"});
    } else {
      usersOnline.push(data.name);
      socket.emit("loggedin", {message: "success"});
    }

    sendStats();
    
  socket.on("disconnect", function(){
    var index = usersOnline.indexOf(socket);
    usersOnline.splice(index,1);
    sendStats();
  });
  });



  socket.on("send", function(data){
    var date = new Date();
    var time = moment().format("HH:mm");
    var message = {sender: data.sender, message: data.message, time: time};
    io.sockets.emit("message", message);
  })
})

server.on('listening', (e) => {
  if (e) return console.log(e);
  console.log("Server is running...")
})

server.listen(80, "0.0.0.0");
