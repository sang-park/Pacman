var Pacman = require('./man');
var Wall = require('./wall');
var Space = require('./space');
var Util = require('./util');

var Game = function () {
  this.ghosts = [];
  this.grid = [];
  this.pacman = new Pacman({game: this});
  this.createGrid();
};

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 650;
Game.FPS = 32;
var GRID_WIDTH = 50;
var GRID_HEIGHT = 50;
var numRows = Game.DIM_X / GRID_HEIGHT;
var numCols = Game.DIM_Y / GRID_WIDTH;

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

Game.prototype.createGrid = function(){
  for (var idx = 0; idx < 20; idx++) {
    this.grid.push(new Array(13));
  }
  var self = this;
  gridOutline.forEach(function(row, i){
    row.forEach(function(spot, j) {
      var options = {
        pos: [j, i],
        side: Game.GRID_WIDTH,
        food: true,
        value: spot
      };

      if (spot === 0){
        self.grid[j][i] = new Wall(options);
      } else if (spot === 4) {
        self.grid[j][i] = self.pacman;
      } else {
        self.grid[j][i] = new Space(options);
      }
    });
  });
};

Game.prototype.draw = function (ctx) {
  var self = this;
  this.allObjects().forEach(function(spot){
    spot.draw(ctx);
  });
};
module.exports = Game;
Game.prototype.allObjects = function () {

  return Util.flatten(this.grid);
};



Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);


  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });
};

Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) || (pos[1] < 0) ||
    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
};

Game.prototype.moveObjects = function (delta) {

  this.allObjects().forEach(function (object) {
    object.move(delta);
  });
};



Game.prototype.step = function (delta) {
  this.moveObjects(delta);
};

Game.prototype.wrap = function (pos) {
  return [
    wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
  ];

  function wrap(coord, max) {
    if (coord < 0) {
      return max - (coord % max);
    } else if (coord > max) {
      return coord % max;
    } else {
      return coord;
    }
  }
};

module.exports = Game;