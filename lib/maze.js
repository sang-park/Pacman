//20 X 13
var Pacman = require('./man');

var Maze = function(game){
  this.game = game;
  this.side = 50;
  this.grid = [];
  this.createGrid();
};
// 0 => wall
// 1 => food
// 2 => power
// 3 => empty
// 4 => pacman
// 5 => ghost
// 6 => empty
var gridOutline = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 5, 3, 3, 5, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 3, 3, 3, 3, 0, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 5, 3, 3, 5, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0],
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

Maze.prototype.createGrid = function(){
  for (var idx = 0; idx < 20; idx++) {
    this.grid.push(new Array(13));
  }
  var self = this;
  gridOutline.forEach(function(row, i){
    row.forEach(function(spot, j) {
      var options = {
        pos: [j, i],
        side: self.side,
        food: true,
        value: spot
      };

      if (spot === 0){
        self.grid[j][i] = new Wall(options);
      } else if (spot === 4) {
          self.grid[j][i] = new Pacman({game: self.game});
      } else {
        self.grid[j][i] = new Space(options);
      }
    });
  });
};

// Maze.prototype.createWalls = funciton(ctx) {
//
// }


Maze.prototype.draw = function (ctx) {
  var self = this;
  self.grid.forEach(function(row,i){
    row.forEach(function(spot,j){
      spot.draw(ctx);
    });
  });
};
module.exports = Maze;
