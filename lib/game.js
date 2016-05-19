var Pacman = require('./man');
var Ghost = require('./ghost');
var Wall = require('./wall');
var Space = require('./space');
var Util = require('./util');

var Game = function () {
  this.score = 0;
  this.ghosts = [];
  this.grid = [];
  this.pacman = new Pacman({game: this});
  this.createGrid();
  this.addGhosts();
  this.count = 111;
  this.over = false;
  this.lost = false;
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
  [0, 2, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 2, 0],
  [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 1, 1, 1, 0, 0, 1, 0, 0, 6, 6, 0, 0, 1, 0, 0, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 5, 3, 3, 5, 0, 1, 0, 0, 0, 0, 1, 0],
  [7, 1, 1, 1, 1, 1, 1, 0, 3, 3, 3, 3, 0, 1, 1, 1, 1, 1, 1, 7],
  [0, 1, 0, 0, 0, 0, 1, 0, 5, 3, 3, 5, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0],
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
  [0, 2, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var COLORS = [
  'red', 'hotpink', 'blue', 'green'
];

Game.prototype.addGhosts = function () {
  //blinky
  var blinky = new Ghost({
    name: "blinky",
    pos: [8,5],
    side: GRID_WIDTH,
    color: 'red',
    game: this,
    startTime: 1000
  }),
  pinky = new Ghost({
    name: "pinky",
    pos: [11,5],
    side: GRID_WIDTH,
    color: 'hotpink',
    game: this,
    startTime: 4000
  }),
  inky = new Ghost({
    name: "inky",
    pos: [8,7],
    side: GRID_WIDTH,
    color: 'teal',
    game: this,
    startTime: 7000
  }),
  clyde = new Ghost({
    name: "clyde",
    pos: [11,7],
    side: GRID_WIDTH,
    color: 'orange',
    game: this,
    startTime: 10000
  });
  this.ghosts = [blinky, pinky, inky,clyde];
};

Game.prototype.createGrid = function(){
  for (var idx = 0; idx < 20; idx++) {
    this.grid.push(new Array(13));
  }
  var self = this;
  gridOutline.forEach(function(row, i){
    row.forEach(function(spot, j) {
      var options = {
        pos: [j, i],
        side: GRID_WIDTH,
        food: true,
        value: spot
      };

      if (spot === 0){
        self.grid[j][i] = new Wall(options);
      } else {
        self.grid[j][i] = new Space(options);
      }
    });
  });
};

Game.prototype.win = function(ctx) {
  this.over = true;

  ctx.fillStyle = '#000000';
  ctx.fillRect(250, 250, 500, 170);

  ctx.beginPath();
  ctx.moveTo(250,250);
  ctx.lineTo(750,250);
  ctx.lineTo(750,420);
  ctx.lineTo(250,420);
  ctx.lineTo(250,250);
  ctx.lineWidth = 6;

  ctx.strokeStyle = 'teal';
  ctx.stroke();

  ctx.font = "48px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign="center";
  ctx.fillText("You Win!", 500, 325);

  ctx.font = "18px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign="center";
  ctx.fillText("Press r to restart", 500, 350);
};

Game.prototype.lose = function() {
  var ctx = this.gameView.ctx;

  ctx.fillStyle = '#000000';
  ctx.fillRect(250, 250, 500, 170);

  ctx.beginPath();
  ctx.moveTo(250,250);
  ctx.lineTo(750,250);
  ctx.lineTo(750,420);
  ctx.lineTo(250,420);
  ctx.lineTo(250,250);
  ctx.lineWidth = 6;

  ctx.strokeStyle = 'teal';
  ctx.stroke();

  this.over = true;
  ctx.font = "48px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign="center";
  ctx.fillText("You Lose", 500, 325);

  ctx.font = "18px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign="center";
  ctx.fillText("Press r to restart", 500, 350);
};

Game.prototype.draw = function (ctx) {
  var self = this;
  this.allObjects().forEach(function(spot){
    spot.draw(ctx);
  });
  ctx.font = "24px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = 'left';
  ctx.fillText("score:" + this.score,30,30);
  ctx.textAlign = 'right';
  // ctx.fillText("press 'm' to mute",980,630);

  if (this.lost){
    this.lose();
  }
};

Game.prototype.allObjects = function () {
  return Util.flatten(this.grid).concat(this.pacman).concat(this.ghosts);
};

Game.prototype.allMovableObjects = function(){
  return this.ghosts.concat(this.pacman);
};

Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) || (pos[1] < 0) ||
    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
};

Game.prototype.moveObjects = function (delta) {
  this.allMovableObjects().forEach(function (object) {
    object.move(delta);
  });
};

Game.prototype.step = function (delta) {
  this.gameView.sirenSound.play();
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
