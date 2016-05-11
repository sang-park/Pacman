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
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(
    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();
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
    var notOppDir =
      this.nextVel[0] * this.vel[0] + this.nextVel[1] * this.vel[1] === 0;
    if (this.notWall(offsetX,offsetY)) { //&& (notOppDir || !this.moving)){ FOR GHOSTS
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
      this.game.grid[tl[0]][tl[1]].isAWall() ||
      this.game.grid[tr[0]][tr[1]].isAWall() ||
      this.game.grid[bl[0]][bl[1]].isAWall() ||
      this.game.grid[br[0]][br[1]].isAWall() ){
    return false;
  } else {
    return true;
  }
};


Movers.prototype.changeDirection = function(vel){
  this.nextVel = vel;
};

module.exports = Movers;
