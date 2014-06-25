var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){

  console.log('a user connected');

  socket.broadcast.emit('hi');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });

  var board = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,1,2,0,1,2,0]
  ];

  function updateBoard(slotNumber, playerId) {
    // from bottom of board
    var revBoard = board.reverse();
    var foundOpenPosition = false;
    for (var i = 0; i < revBoard.length; i++) {
      if (revBoard[i] != 0) {
        foundOpenPosition = true;
        revBoard[i][slotNumber] = playerId;
        break;
      }
    }
    if (!foundOpenPosition) {
      // emit an error saying there aren't open positions in that slot
      io.emit('connect4-move-error');
      return false;
    }
    board = revBoard.reverse();
    return board;

    // can I insert coin?

    // yes - insert - return;

    // no - move up 1 row - return on success;

    // cant move up any more - return false;
  }

  socket.on('connect4', function(msg){
    console.log("starting connect 4");
    io.emit('connect4', board);
  });

  socket.on('connect4-move', function(msg) {
    var msg = msg || {};
    player = playerId(socket.id);
    console.log("Player " + player + " moved to " + msg.move);

    io.emit('connect4', updateBoard(msg.move, player));
  });

  function playerId(socketId) {
    var clientIds = Object.keys(socket.conn.server.clients);
    if (clientIds[0] == socketId) {
      return 1;
    } else {
      return 2;
    }
  }
});
