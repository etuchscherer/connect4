$(document).ready(function() {

  var socket = io();

  function cell(x,y) {
    return $('.row'+y+' :eq('+x+')').find('span.label');
  }

  socket.on('connect4', function(msg){
    for (var y = 0; y < 6; y++) {
      for (var x = 0; x < 7; x++) {
        cellSpan = cell(x,y).text(msg[y][x]);
      }
    }
  });

  $('a.coin-slot').click(function(e) {
    e.preventDefault();
    value = $(e.target).data('id');

    console.log('you clicked id:', value);

    socket.emit('connect4-move', {move: value});
  });

  $('a.send').click(function(e){
    e.preventDefault();
    socket.emit('connect4', 'foo');
    console.log('emiting message');
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
});