/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(8);
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  new GameView(game, ctx).start(true);
	  window.game = game;
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Pacman = __webpack_require__(2);
	var Ghost = __webpack_require__(5);
	var Wall = __webpack_require__(6);
	var Space = __webpack_require__(7);
	var Util = __webpack_require__(3);
	
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
	  this.DIM_X = 600;
	  this.DIM_Y = 390;
	};
	
	Game.BG_COLOR = "#000000";
	Game.DIM_X = 600;
	Game.DIM_Y = 390;
	Game.FPS = 32;
	var GRID_WIDTH = 30;
	var GRID_HEIGHT = 30;
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
	  ctx.font = "16px Arial";
	  ctx.fillStyle = "white";
	  ctx.textAlign = 'left';
	  ctx.fillText("score:" + this.score,5,20);
	  ctx.textAlign = 'left';
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var Mover = __webpack_require__(4);
	
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir: function (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	  // Find distance between two points.
	  dist: function (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	  // Find the length of the vector.
	  norm: function (vec) {
	    return Util.dist([0, 0], vec);
	  },
	  // Return a randomly oriented vector with the given length.
	  randomVec : function (length) {
	    var deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	  // Scale the length of a vector by the given amount.
	  scale: function (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	  inherits: function (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass ;}
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },
	  flatten: function(arr) {
	    return arr.reduce(function (flat, toFlatten) {
	      return flat.concat(
	        Array.isArray(toFlatten) ? Util.flatten(toFlatten) : toFlatten
	      );
	    }, []);
	  }
	
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var Game = __webpack_require__(1);
	
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
	  return centerDist < (this.radius + otherObject.radius -10);
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
	
	Movers.prototype.notWall = function (x,y) {
	  var newX = this.pos[0] + x;
	  var newY = this.pos[1] + y;
	  var tl = [
	    Math.floor((newX - this.radius-2.5)/this.game.DIM_X*this.game.grid.length),
	    Math.floor((newY - this.radius-2.5)/this.game.DIM_Y*this.game.grid[0].length),
	  ];
	  var tr = [
	    Math.floor((newX - this.radius-2.5)/this.game.DIM_X*this.game.grid.length),
	    Math.floor((newY + this.radius+2.5)/this.game.DIM_Y*this.game.grid[0].length),
	  ];
	  var bl = [
	    Math.floor((newX + this.radius+2.5)/this.game.DIM_X*this.game.grid.length),
	    Math.floor((newY - this.radius-2.5)/this.game.DIM_Y*this.game.grid[0].length),
	  ];
	  var br = [
	    Math.floor((newX + this.radius+2.5)/this.game.DIM_X*this.game.grid.length),
	    Math.floor((newY + this.radius+2.5)/this.game.DIM_Y*this.game.grid[0].length),
	  ];
	  if (newX  < 0 || newX > this.game.DIM_X) {
	    this.pos = this.game.wrap(this.pos);
	  }
	
	  if (this.anyWall([tl,tr,bl,br])) {
	    return false;
	  } else {
	    return true;
	  }
	};
	
	Movers.prototype.anyWall = function (arr) {
	  var wall = false;
	
	  arr.forEach(function(pos){
	    if ( pos[0] >= 0 && pos[1] >= 0 && pos[0] < 20 && pos[1] < 13 &&
	      this.game.grid[pos[0]][pos[1]].isAWall(this) ) {
	      wall = true;
	    }
	
	  }.bind(this));
	  return wall;
	};
	
	Movers.prototype.handleMovement = function () {
	  var x = Math.floor(this.pos[0] / this.game.DIM_X*this.game.grid.length),
	      y = Math.floor(this.pos[1] / this.game.DIM_Y*this.game.grid[0].length);
	
	  if (x < 0 || x > 19 || !this.isPacman()) {
	    return;
	  } else if (this.game.grid[x][y].value === 1) {
	    this.game.grid[x][y].value = 3;
	    this.game.score += 10;
			this.game.count --;
	    this.game.gameView.wakaSound.play();
	  } else if (this.game.grid[x][y].value === 2) {
	    this.game.gameView.wakaSound.play();
	    this.game.grid[x][y].value = 3;
	    this.game.score += 50;
			this.game.count --;
	    this.game.ghosts.forEach(function(ghost){
	      ghost.turnWeak();
	    });
	  }
	
	};
	
	
	Movers.prototype.changeDirection = function(vel){
	  this.nextVel = vel;
	};
	
	module.exports = Movers;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var Mover = __webpack_require__(4);
	
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
			&& this.setUp) {
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


/***/ },
/* 6 */
/***/ function(module, exports) {

	var Wall = function(options){
	  this.pos = options.pos;
	  this.side = options.side;
	};
	
	Wall.prototype = {
	  draw: function(ctx){
	    var startX = this.pos[0] * this.side;
	    var startY = this.pos[1] * this.side;
	    ctx.fillStyle = '#0000ff';
	    ctx.fillRect(startX,startY, startX + this.side, startY + this.side);
	  },
	
	  move: function(){
	    return;
	  },
	
	  isAWall: function(){
	    return true;
	  }
	};
	
	module.exports = Wall;


/***/ },
/* 7 */
/***/ function(module, exports) {

	var Space = function(options){
	  this.pos = options.pos;
	  this.side = options.side;
	  this.type = null;
	  this.radius = 0;
	  this.value = options.value;
	  this.setUp();
	};
	
	Space.prototype.setUp = function () {
	  if (this.value === 1) {
	    this.type = "food";
	    this.radius = 3;
	  } else if (this.value === 2) {
	    this.type = "power";
	    this.radius = 5;
	  } else if (this.value === 3) {
	    this.type = "empty";
	  }
	};
	
	Space.prototype.draw = function (ctx) {
	  var startX = this.pos[0] * this.side;
	  var startY = this.pos[1] * this.side;
	  ctx.fillStyle = '#000000';
	  ctx.fillRect(startX,startY, startX + this.side, startY + this.side);
	  ctx.beginPath();
	
	  if (this.value < 3) {
	    var offset = this.side / 2;
	    ctx.fillStyle = 'white';
	    ctx.beginPath();
	    ctx.arc(
	      startX + offset, startY + offset, this.radius, 0, 2 * Math.PI, true
	    );
	    ctx.fill();
	  } else {
	
	  }
	};
	
	Space.prototype.move = function () {
	  return;
	};
	
	Space.prototype.isAWall = function (type) {
	  if (this.value === 6) {
	    if (!type.isPacman() && type.setUp) {
	      return false;
	    } else {
	      return true;
	    }
	  } else if (!type.isPacman() && this.value === 7){
	    return true;
	  } else if (!type.isPacman() && this.value === 7){
	    return true;
	  } else {
	    return false;
	  }
	};
	module.exports = Space;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var Sound = __webpack_require__(9);
	
	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.pacman = this.game.pacman;
	  this.game.gameView = this;
	  this.mute = false;
	  this.openingSound = new Sound('./sounds/opening.mp3', this);
	  this.wakaSound = new Sound('./sounds/wakawaka.mp3', this);
	  this.sirenSound = new Sound('./sounds/siren.mp3', this);
	  this.deathSound = new Sound('./sounds/death.mp3', this);
	  this.ghostDeathSound = new Sound('./sounds/ghost_death.mp3', this);
	  this.first = true;
	};
	
	
	GameView.MOVES = {
	  "w": [ 0, -3],
	  "a": [-3,  0],
	  "s": [ 0,  3],
	  "d": [ 3,  0],
	  up: [0, -3],
	  down: [0, 3],
	  left: [-3, 0],
	  right: [3, 0],
	};
	
	GameView.prototype.bindKeyHandlers = function () {
	  var pacman = this.pacman;
	
	  Object.keys(GameView.MOVES).forEach(function (k) {
	    var move = GameView.MOVES[k];
	    key(k, function () {
	      pacman.changeDirection(move);
	    });
	  });
	
	  key("r", function(){
	    if (this.game.over){
	      this.restart();
	    }
	  }.bind(this));
	
	  key("m", function(){
	    this.mute = !this.mute;
	    // Sound.toggleSound();
	  }.bind(this));
	
	  key("space", function(){
	    if (this.first) {
	      this.first = false;
	      this.game = new Game;
	      this.game.gameView = this;
	      this.pacman = this.game.pacman;
	      this.bindKeyHandlers();
	
	      requestAnimationFrame(this.animate.bind(this));
	    }
	  }.bind(this));
	};
	
	GameView.prototype.restart = function(){
	  this.game = new Game;
	  this.game.gameView = this;
	  this.pacman = this.game.pacman;
	
	  this.start();
	};
	
	GameView.prototype.start = function () {
	  this.bindKeyHandlers();
	  this.lastTime = 0;
	
	
	  if (this.first) {
	    this.game.draw(this.ctx);
	    this.ctx.fillStyle = '#000000';
	    this.ctx.fillRect(250, 250, 500, 170);
	
	    this.ctx.beginPath();
	    this.ctx.moveTo(250,250);
	    this.ctx.lineTo(750,250);
	    this.ctx.lineTo(750,420);
	    this.ctx.lineTo(250,420);
	    this.ctx.lineTo(250,250);
	    this.ctx.lineWidth = 6;
	
	    this.ctx.strokeStyle = 'teal';
	    this.ctx.stroke();
	
	
	    this.ctx.font = "24px Press Start 2P";
	    this.ctx.fillStyle = "yellow";
	    this.ctx.textAlign="center";
	    this.ctx.fillText("Use WASD or the arrow keys", 500, 300);
	    this.ctx.fillText("Eat Pelets, Avoid Ghosts", 500, 350);
	    this.ctx.fillText("Press 'spacebar' to begin!", 500, 400);
	
	  } else {
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	};
	
	GameView.prototype.animate = function(time){
	  this.first = false;
	
	  var timeDelta = time - this.lastTime;
	
	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	
	  if (this.game.count === 0){
	    this.game.win(this.ctx);
	  } else if (!this.game.over){
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	
	};
	
	module.exports = GameView;


/***/ },
/* 9 */
/***/ function(module, exports) {

	var Sound = function(src, gameView) {
	    this.gameView = gameView;
	    this.sound = document.createElement("audio");
	    this.sound.src = src;
	    this.sound.setAttribute("preload", "auto");
	    this.sound.setAttribute("controls", "none");
	    this.sound.style.display = "none";
	    document.body.appendChild(this.sound);
	};
	
	Sound.prototype = {
	  play: function(){
	    if (!this.gameView.mute){
	      // this.sound.play();
	    }
	  },
	  stop: function(){
	    this.sound.pause();
	  },
	};
	
	
	module.exports = Sound;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map