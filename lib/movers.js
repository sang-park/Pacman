var Util = require("./util");
var Game = require("./game");

var Movers = function (options) {
  this.pos = options.pos;
  this.color = options.color;
  this.radius = options.radius;
  this.vel = options.vel;
  this.lastVel = null;
  this.currentDirection = null;
  this.game = options.game;
};

Movers.prototype.draw = function (ctx) {
  return;
};

Movers.prototype.isCollidedWith = function (otherObject) {
  var centerDist = Util.dist(this.pos, otherObject.pos);
  return centerDist < (this.radius + otherObject.radius);
};

Movers.prototype.isWrappable = true;

var NORMAL_FRAME_TIME_DELTA = 1000/60;

Movers.prototype.move = function (timeDelta) {
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA, offsetX, offsetY;

  if (this.nextVel) {
    offsetX = this.nextVel[0] * velocityScale;
    offsetY = this.nextVel[1] * velocityScale;
    if (this.notWall(offsetX,offsetY)) {
      this.vel = this.nextVel;
      this.nextVel = null;
      this.moving = true;
    }
  }

  offsetX = this.vel[0] * velocityScale;
  offsetY = this.vel[1] * velocityScale;
  if (this.notWall(offsetX, offsetY)){
    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
    this.handleMovement();
  } else {
    this.moving = false;
    this.nextVel = null;
  }
};

Movers.prototype.setNextVel = function(){
  return;
};
Movers.prototype.handleMovement = function () {
  return;
};

Movers.prototype.notWall = function (x,y) {
  var newX = this.pos[0] + x;
  var newY = this.pos[1] + y;
  var tl = [
    Math.floor((newX - this.radius-2.5)/1000*this.game.grid.length),
    Math.floor((newY - this.radius-2.5)/650*this.game.grid[0].length),
  ];
  var tr = [
    Math.floor((newX - this.radius-2.5)/1000*this.game.grid.length),
    Math.floor((newY + this.radius+2.5)/650*this.game.grid[0].length),
  ];
  var bl = [
    Math.floor((newX + this.radius+2.5)/1000*this.game.grid.length),
    Math.floor((newY - this.radius-2.5)/650*this.game.grid[0].length),
  ];
  var br = [
    Math.floor((newX + this.radius+2.5)/1000*this.game.grid.length),
    Math.floor((newY + this.radius+2.5)/650*this.game.grid[0].length),
  ];
  if (newX - this.radius - 2.5 < 0 || newX + this.radius + 2.5 > 1000) {
    this.pos = this.game.wrap(this.pos);
    return true;
  } else if (
      this.game.grid[tl[0]][tl[1]].isAWall(this) ||
      this.game.grid[tr[0]][tr[1]].isAWall(this) ||
      this.game.grid[bl[0]][bl[1]].isAWall(this) ||
      this.game.grid[br[0]][br[1]].isAWall(this) ){
    return false;
  } else {
    return true;
  }
};

Movers.prototype.handleMovement = function () {
  var x = Math.floor(this.pos[0]/1000*this.game.grid.length),
      y = Math.floor(this.pos[1]/650*this.game.grid[0].length);
  if (x < 0 || x > 19 || !this.isPacman()) {
    return;
  } else if (this.game.grid[x][y].value === 1) {
    this.game.grid[x][y].value = 3;
    this.game.score += 10;
		this.game.count --;
  } else if (this.game.grid[x][y].value === 2) {
    this.game.grid[x][y].value = 3;
    this.game.score += 50;
		this.game.count --;
  }

  if (this.isPacman()){
    this.game.ghosts.forEach(function(ghost){
      if(this.isCollidedWith(ghost)){
        this.game.lost = true;
      }
    }.bind(this));
  } 
};


Movers.prototype.changeDirection = function(vel){
  this.nextVel = vel;
};

module.exports = Movers;
