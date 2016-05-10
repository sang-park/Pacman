var Util = require("./util");
var Mover = require("./movers");

var DEFAULTS = {
	COLOR: "#ffff00",
	RADIUS: 20,
  VELOCITY: [0,0],
	POS: [525, 475]
};

var Pacman = function (options={}) {
  options.color = DEFAULTS.COLOR;
  options.pos = DEFAULTS.POS;
  options.radius = DEFAULTS.RADIUS;
  options.vel = DEFAULTS.VELOCITY;


  Mover.call(this, options);
};


Pacman.prototype.collideWith = function (otherObject) {
  if (otherObject.type === "Ship") {
    otherObject.relocate();
  }
};

Util.inherits(Pacman, Mover);

Pacman.prototype.type = "Pacman";

module.exports = Pacman;
