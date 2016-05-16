var Util = require("./util");
var Mover = require("./movers");

var DEFAULTS = {
	RADIUS: 20,
  VELOCITY: [0,0],
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
	this.setUp = true;

	setTimeout(function(){
		this.moveGhost();
	}.bind(this), options.startTime);
};

Util.inherits(Ghost, Mover);
Ghost.prototype.type = "Ghost";

var movements = [
	[5.2,0],
	[-5.2,0],
	[0,5.2],
	[0,-5.2]
];

Ghost.prototype.moveGhost = function () {
	switch (this.name) {
		case "blinky":
			this.vel = movements[0];
			break;
		case "pinky":
			this.vel = movements[1];
			break;
		case "inky":
			this.vel = movements[0];
			break;
		case "clyde":
			this.vel = movements[1];
			break;
	}
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;
Ghost.prototype.isWrappable = false;

Ghost.prototype.getGhostOut = function(){
	if (this.pos[0] > 495 && this.pos[0] < 505 && this.setUp) {
		if (this.pos[1] > 180) {
			this.vel = 	movements[3];
		} else {
			this.setUp = false;
			this.setRandomVel();
		}
	}
};

Ghost.prototype.changeDirection = function (velocityScale) {
	if (this.nextVel) {
		var offsetX = this.nextVel[0] * velocityScale,
		offsetY = this.nextVel[1] * velocityScale;
		if (this.notWall(offsetX,offsetY)) {
			this.vel = this.nextVel;
			this.moving = true;
		}
		while (
				this.vel[0] * this.nextVel[0] +
					this.vel[1] * this.nextVel[1] !== 0 ) {
			this.setRandomVel();
		}

	}
};

Ghost.prototype.move = function (timeDelta) {

	var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA, offsetX, offsetY;
	if (this.setUp) {
		this.getGhostOut();
	} else {
		this.changeDirection(velocityScale);
	}

	offsetX = this.vel[0] * velocityScale;
	offsetY = this.vel[1] * velocityScale;

	if (this.notWall(offsetX,offsetY)) {
		this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
		this.handleMovement();
	} else {
		this.setRandomVel();
	}



  if (this.isCollidedWith(this.game.pacman)){
    this.game.lost = true;
  }
};

Ghost.prototype.setRandomVel = function () {
	this.nextVel = movements[Math.floor(Math.random()*4)];
};

Ghost.prototype.followPacman = function () {

	var pos = this.game.pacman.pos,
			dx = this.pos[0] - pos[0],
			dy = this.pos[1] - pos[1];
	if (Math.abs(dx) > Math.abs(dy)){
		if (dx > 0){
			this.nextVel = movements[1];
		} else {
			this.nextVel = movements[0];
		}
	} else {
		if (dy > 0){
			this.nextVel = movements[3];
		} else {
			this.nextVel = movements[2];
		}
	}

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
