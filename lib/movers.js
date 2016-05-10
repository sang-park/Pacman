var Util = require("./util");

var Movers = function (options) {
  this.pos = options.pos;
  this.color = options.color;
  this.radius = options.radius;
  this.vel = options.vel;
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
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
    offsetX = this.vel[0] * velocityScale,
    offsetY = this.vel[1] * velocityScale;
  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];



  if (this.game.isOutOfBounds(this.pos)) {
    this.pos = this.game.wrap(this.pos);
  }
};

Movers.prototype.changeDirection = function(vel){
  this.vel = vel;
};

module.exports = Movers;
