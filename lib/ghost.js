var Util = require("./util");
var Mover = require("./movers");

var DEFAULTS = {
	RADIUS: 11,
  VELOCITY: [0,0],
};

var Ghost = function (options) {
  options.pos = [
    options.side*(options.pos[0]+0.5),
    options.side*(options.pos[1]+0.5)
  ];
  options.radius = DEFAULTS.RADIUS;
  options.vel = DEFAULTS.VELOCITY;
	this.OGOptions = options;
  Mover.call(this, options);
	this.name = options.name;
	this.setUp = true;
	this.weak = false;
	this.changing = false;
	this.OGPos = this.pos;
	this.counter = 0;

	setTimeout(function(){
		this.moveGhost();
	}.bind(this), options.startTime);
};

Util.inherits(Ghost, Mover);
Ghost.prototype.type = "Ghost";

var movements = [
	[3.2,0],
	[-3.2,0],
	[0,3.2],
	[0,-3.2]
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

Ghost.prototype.turnWeak = function(){
	this.weak = true;
	this.counter++;
	var self = this;
	setTimeout(function(){
		self.revert(self.counter);
	}, 4000);
};

Ghost.prototype.toggleColor = function(counter, first, last){
	if (this.counter  === counter ) {
		this.changing = this.changing ? false : true;

		if (last) {
			this.weak = false;
			this.changing = false;
		} else if (first) {
			this.weak = true;
			this.changing = true;

		}
	}
};

Ghost.prototype.revert = function(counter){
	var self = this;
	setTimeout(function(){
		self.toggleColor(counter, true);
	},500);
	setTimeout(function(){
		self.toggleColor(counter);
	},1000);
	setTimeout(function(){
		self.toggleColor(counter);
	},1400);
	setTimeout(function(){
		self.toggleColor(counter);
	},1700);
	setTimeout(function(){
		self.toggleColor(counter);
	},2000);
	setTimeout(function(){
		self.toggleColor(counter);
	},2300);
	setTimeout(function(){
		self.toggleColor(counter);
	},2600);
	setTimeout(function(){
		self.toggleColor(counter);
	},2900);
	setTimeout(function(){
		self.toggleColor(counter, false, true);
	},3200);
};

Ghost.prototype.getGhostOut = function(){
	// changinggg
	if (this.pos[0] > this.game.DIM_X / 2 - 5
		&& this.pos[0] < this.game.DIM_Y / 2 + 5
		&& this.setUp) {)
		if (this.pos[1] > 180/650 * this.game.DIM_Y) {
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
	if (this.name === "blinky") {
		console.log(this.pos)
	}
	var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA, offsetX, offsetY,
	weakened = 1;
	if (this.setUp) {
		this.getGhostOut();
	} else {
		this.changeDirection(velocityScale);
	}

	if (this.weak) {
		weakened = 0.5;
	}

	offsetX = this.vel[0] * velocityScale * weakened;
	offsetY = this.vel[1] * velocityScale * weakened;

	if (this.notWall(offsetX,offsetY)) {
		this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
		this.handleMovement();
	} else {
		this.setRandomVel();
	}

	if (this.isCollidedWith(this.game.pacman)){
		if (this.weak){
			this.getEaten();
			this.game.score += 200;
		} else {
			this.game.lost = true;
			this.game.gameView.wakaSound.stop();
			this.game.gameView.sirenSound.stop();
			this.game.gameView.deathSound.play();
		}
	}
};

Ghost.prototype.getEaten = function () {
  Mover.call(this, this.OGOptions);
	this.setUp = true;
	this.weak = false;
	this.changing = false;

	setTimeout(function(){
		this.moveGhost();
	}.bind(this), 2000);

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
	if (!this.weak || this.changing){
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
	  this.drawFace(ctx, false);
	} else {
		ctx.fillStyle = 'blue';
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
	  this.drawFace(ctx, true);
	}
};

Ghost.prototype.drawFace = function (ctx, isWeak) {
	if (isWeak) {
		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.arc(
			this.pos[0] - this.radius*0.4,
			this.pos[1] - this.radius*0.3,
			this.radius * 0.3,
			0, 2*Math.PI, true
		);
		ctx.fill();

		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.arc(
			this.pos[0] + this.radius*0.4,
			this.pos[1] - this.radius*0.3,
			this.radius *0.3,
			0, 2*Math.PI, true
		);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(this.pos[0] - this.radius * 0.9 , this.pos[1] + this.radius * 0.2);
		ctx.lineTo(this.pos[0] - this.radius * 0.6 , this.pos[1] + this.radius * 0.4);
		ctx.lineTo(this.pos[0] - this.radius * 0.3  , this.pos[1] + this.radius * 0.2);
		ctx.lineTo(this.pos[0] , this.pos[1] + this.radius * 0.4);
		ctx.lineTo(this.pos[0] + this.radius * 0.3 , this.pos[1] + this.radius * 0.2);
		ctx.lineTo(this.pos[0] + this.radius * 0.6 , this.pos[1] + this.radius * 0.4);
		ctx.lineTo(this.pos[0] + this.radius * 0.9 , this.pos[1] + this.radius * 0.2);
		ctx.lineWidth = 3;

		ctx.strokeStyle = '#ffffff';
		ctx.stroke();

	} else {
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
	}
};

Ghost.prototype.isPacman = function () {
  return false;
};




module.exports = Ghost;
