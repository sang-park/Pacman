var Util = require("./util");
var Mover = require("./movers");

var DEFAULTS = {
	COLOR: "#ffff00",
	RADIUS: 11,
  VELOCITY: [0,0],
	POS: [315, 285]
};

var Pacman = function (options={}) {
  options.color = DEFAULTS.COLOR;
  options.pos = DEFAULTS.POS;
  options.radius = DEFAULTS.RADIUS;
  options.vel = DEFAULTS.VELOCITY;


  Mover.call(this, options);
  this.drawing = 0.1;
  this.increment = 0.02;
};
Util.inherits(Pacman, Mover);

Pacman.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  var startR1, endR1, startR2, endR2, rotation = 0;
  if (this.vel[0] < 0) {
    rotation = 1;
  } else if (this.vel[1] < 0){
    rotation = 1.5;
  } else if (this.vel[1] > 0){
    rotation = 0.5;
  }
  startR1 = 0.25 - this.drawing + rotation;
  endR1 = 1.25 - this.drawing+ rotation;
  startR2 = 0.75 + this.drawing+ rotation;
  endR2 = 1.75 + this.drawing+ rotation;

  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, startR1 * Math.PI, endR1 * Math.PI, false);
  ctx.fillStyle = "rgb(255, 255, 0)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, startR2 * Math.PI, endR2 * Math.PI, false);
  ctx.fill();
  this.drawing += this.increment;

  if (!this.moving ){
    this.drawing = 0.1;
  } else if (this.drawing > 0.20 || this.drawing < 0.1) {
    this.increment = -1 * this.increment;
  }
};

Pacman.prototype.isPacman = function () {
  return true;
};



Pacman.prototype.type = "Pacman";

module.exports = Pacman;
