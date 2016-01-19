var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bs = require('./lib/battleships.js');

var total = 0, online = 0, created = new Date();
var lobby = null;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

function startGame(p1, p2) {
  console.log('Starting new game with ' + p1.name + ' and ' + p2.name);
  var g = new bs.Game(p1, p2);

  p1.socket.emit('newGame', {
    you: p1.name,
    ships: p1.ships,
    opponent: p2.name
  });

  p2.socket.emit('newGame', {
    you: p2.name,
    ships: p2.ships,
    opponent: p1.name
  });

  p1.socket.emit('turn', {msg: 'player 1 turn'});

  p1.socket.on('shoot', function (msg) {
    if (g.p1Turn) {
      console.log(msg);
    }
  });
}

io.on('connection', function (socket) {

  total++;
  online++;

  socket.emit('welcome', {total: total, online: online, created: created});
  socket.broadcast.emit('playerJoin');

  socket.on('disconnect', function () {
    online--;
    io.emit('playerLeft');
  });

  socket.on('ready', function (data) {
    console.log((data || 'Player') + ' is ready for battle');

    var me = new bs.Player(data || 'Player');
    me.socket = socket;
    me.generateShips();

    if (lobby) {
      startGame(lobby, me);
      lobby = null;
    } else {
      lobby = me;
    }

  });

});

http.listen(3000, function () {
  console.log('Battleships are ready at port 3000');
});