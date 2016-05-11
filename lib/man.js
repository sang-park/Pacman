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
Util.inherits(Pacman, Mover);

Pacman.prototype.handleMovement = function () {
  var x = Math.floor(this.pos[0]/1000*this.game.grid.length),
      y = Math.floor(this.pos[1]/650*this.game.grid[0].length);
  if (x < 0 || x > 19) {
    return;
  } else if (this.game.grid[x][y].value === 1) {
    this.game.grid[x][y].value = 3;
    this.game.score += 10;
  } else if (this.game.grid[x][y].value === 2) {
    this.game.grid[x][y].value = 3;
    this.game.score += 50;
  }

}

Pacman.prototype.collideWith = function (otherObject) {
  if (otherObject.type === "Ship") {
    otherObject.relocate();
  }
};


Pacman.prototype.type = "Pacman";

module.exports = Pacman;
