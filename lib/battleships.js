function Player(name) {
  this.name = name;
  this.ships = [];
}

Player.prototype.occupies = function (x, y) {
  return this.ships.find(function (ship) {
    return ship.occupies(x, y);
  });
};

Player.prototype.board = function () {
  var self = this;
  var lines = ['  0 1 2 3 4 5 6 7 8 9'];
  for (var y = 0; y < 10; y++) {
    var line = y + '';
    for (var x = 0; x < 10; x++) {
      var ship = self.occupies(x, y);
      var dot = ship ? ship.letter : ' ';
      line += '|' + dot + '';
    }
    lines.push(line + '|');
  }
  console.log(lines);
  return lines;

};

Player.prototype.generateShips = function () {
  // tidy this
  this.ships.push(
    new Ship(0, 0, 5, true, 'A'),
    new Ship(2, 5, 4, true, 'B'),
    new Ship(5, 1, 3, true, 'C'),
    new Ship(1, 3, 2, true, 'D'),
    new Ship(6, 6, 2, true, 'E'),
    new Ship(4, 9, 1, true, 'F'),
    new Ship(1, 9, 1, true, 'G')
  );
};

function Ship(x, y, size, h, letter) {
  this.size = size || 1;
  this.x = x;
  this.y = y;
  this.h = h;
  this.letter = letter;
  this.squares = function () {
    var o = [];
    for (var i = 0; i < this.size; i++) {
      o.push([this.x + (this.h ? i : 0), this.y + (!this.h ? i : 0)]);
    }
    return o;
  }
}

Ship.prototype.occupies = function (x, y) {
  return this.squares().find(function (square) {
    return (square[0] === x) && (square[1] === y);
  });
};

function Game(player1, player2) {
  this.p1 = player1;
  this.p2 = player2;
  this.p1Turn = true;
  this.p2Turn = !this.p1Turn;
}

module.exports = {
  Player: Player,
  Ship: Ship,
  Game: Game
};