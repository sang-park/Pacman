var Util = require("./util");
var Mover = require("./movers");

var DEFAULTS = {
	RADIUS: 20,
  VELOCITY: [0,0],
	POS: [525, 475]
};

var Ghost = function (options) {
  options.pos = [
    options.side*(options.pos[0]+0.5),
    options.side*(options.pos[1]+0.5)
  ];
  options.radius = DEFAULTS.RADIUS;
  options.vel = DEFAULTS.VELOCITY;
  Mover.call(this, options);
	this.name = options.name;
	setTimeout(function(){
		this.moveGhost();
	}.bind(this), options.startTime);
};

Util.inherits(Ghost, Mover);
Ghost.prototype.type = "Ghost";

var movements = [
	[4,0],
	[-4,0],
	[0,4],
	[0,-4]
];
Ghost.prototype.moveGhost = function () {
	switch (this.name) {
		case "blinky":
			this.vel = movements[0];
			this.nextVel = movements[3];
			break;
		case "pinky":
			this.vel = movements[1];
			this.nextVel = movements[3];
			break;
		case "inky":
			this.vel = movements[0];
			setTimeout(function(){
				this.nextVel = movements[3];
			}.bind(this), 200);
			break;
		case "clyde":
		this.vel = movements[1];
		setTimeout(function(){
			this.nextVel = movements[3];
		}.bind(this),200);
			break;
	}
};

Ghost.prototype.setNextVel = function () {
	this.nextVel = movements[Math.floor(Math.random()*4)];
};

Ghost.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(
    this.pos[0], this.pos[1], this.radius, 0, Math.PI, true
  );
  ctx.rect(
    this.pos[0] - this.radius, this.pos[1], this.radius*2, this.radius*0.8
  );
  ctx.fill();
  for (var i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(
      this.pos[0] - this.radius*0.8 + i*this.radius*0.4,
      this.pos[1] + this.radius*0.8,
      this.radius * 0.2,
      Math.PI, 2*Math.PI, true
    );
    ctx.fill();
  }
  this.drawFace(ctx);
};

Ghost.prototype.drawFace = function (ctx) {
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.arc(
    this.pos[0] - this.radius*0.4,
    this.pos[1] - this.radius*0.3,
    this.radius * 0.4,
    0, 2*Math.PI, true
  );
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = 'blue';
  ctx.arc(
    this.pos[0] - this.radius*0.2,
    this.pos[1] - this.radius*0.3,
    this.radius * 0.2,
    0, 2*Math.PI, true
  );
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.arc(
    this.pos[0] + this.radius*0.4,
    this.pos[1] - this.radius*0.3,
    this.radius * 0.4,
    0, 2*Math.PI, true
  );
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = 'blue';
  ctx.arc(
    this.pos[0] + this.radius*0.6,
    this.pos[1] - this.radius*0.3,
    this.radius * 0.2,
    0, 2*Math.PI, true
  );
  ctx.fill();
};

Ghost.prototype.isPacman = function () {
  return false;
};

Ghost.prototype.collideWith = function (otherObject) {
};



module.exports = Ghost;
