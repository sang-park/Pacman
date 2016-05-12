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
	var GameView = __webpack_require__(2);
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Pacman = __webpack_require__(3);
	var Ghost = __webpack_require__(11);
	var Wall = __webpack_require__(7);
	var Space = __webpack_require__(9);
	var Util = __webpack_require__(4);
	
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
	};
	
	Game.BG_COLOR = "#000000";
	Game.DIM_X = 1000;
	Game.DIM_Y = 650;
	Game.FPS = 32;
	var GRID_WIDTH = 50;
	var GRID_HEIGHT = 50;
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
	    color: 'yellow',
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
	  ctx.font = "48px Arial";
	  ctx.fillStyle = "white";
	  ctx.textAlign="center";
	  ctx.fillText("You Win!", 500, 325);
	
	  ctx.font = "18px Arial";
	  ctx.fillStyle = "white";
	  ctx.textAlign="center";
	  ctx.fillText("Press R to restart", 500, 350);
	};
	
	Game.prototype.lose = function() {
	  var ctx = this.gameView.ctx;
	  this.over = true;
	  ctx.font = "48px Arial";
	  ctx.fillStyle = "white";
	  ctx.textAlign="center";
	  ctx.fillText("You Lose", 500, 325);
	
	  ctx.font = "18px Arial";
	  ctx.fillStyle = "white";
	  ctx.textAlign="center";
	  ctx.fillText("Press R to restart", 500, 350);
	};
	
	Game.prototype.draw = function (ctx) {
	  var self = this;
	  this.allObjects().forEach(function(spot){
	    spot.draw(ctx);
	  });
	  ctx.font = "24px Arial";
	  ctx.fillStyle = "white";
	  ctx.textAlign = 'left';
	  ctx.fillText("score:" + this.score,20,20);
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

	var Game = __webpack_require__(1);
	
	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.pacman = this.game.pacman;
	  this.game.gameView = this;
	
	};
	
	
	GameView.MOVES = {
	  "w": [ 0, -5],
	  "a": [-5,  0],
	  "s": [ 0,  5],
	  "d": [ 5,  0],
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
	};
	
	GameView.prototype.restart = function(){
	  this.game = new Game;
	  this.game.gameView = this;
	  this.pacman = this.game.pacman;
	  this.bindKeyHandlers();
	
	  this.lastTime = 0;
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.start = function () {
	  this.bindKeyHandlers();
	  this.lastTime = 0;
	  //start the animation
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function(time){
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var Mover = __webpack_require__(5);
	
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
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
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


/***/ },
/* 6 */,
/* 7 */
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
/* 8 */,
/* 9 */
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
	    this.radius = 5;
	  } else if (this.value === 2) {
	    this.type = "power";
	    this.radius = 10;
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
	
	  if (this.value === 6 && (!type.isPacman() && !type.setUp )) {
	    return true;
	  } else if (!type.isPacman() && this.value === 7){
	    return true;
	  } else {
	    return false;
	  }
	};
	module.exports = Space;


/***/ },
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var Mover = __webpack_require__(5);
	
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
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	Ghost.prototype.isWrappable = false;
	
	Ghost.prototype.move = function (timeDelta) {
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
			if (!this.moving) {
				this.setRandomVel();
			}
	    this.moving = false;
	    this.nextVel = null;
			this.setRandomVel();
			if (this.setUp){
				this.setUp = false;
			}
	  }
	  if (this.isCollidedWith(this.game.pacman)){
	    this.game.lost = true;
	  }
	};
	Ghost.prototype.setRandomVel = function () {
		this.nextVel = movements[Math.floor(Math.random()*4)];
		while (this.nextVel && this.vel &&
			this.nextVel[0] + this.vel[0] === 0 &&
			 this.nextVel[1] + this.vel[1] === 0){
			 this.nextVel = movements[Math.floor(Math.random()*4)];
		}
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map