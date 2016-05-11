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
	var Wall = __webpack_require__(7);
	var Space = __webpack_require__(9);
	var Util = __webpack_require__(4);
	
	var Game = function () {
	  this.score = 0;
	  this.ghosts = [];
	  this.grid = [];
	  this.pacman = new Pacman({game: this});
	  this.createGrid();
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
	  [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0],
	  [0, 1, 0, 0, 0, 0, 1, 0, 5, 3, 3, 5, 0, 1, 0, 0, 0, 0, 1, 0],
	  [3, 1, 1, 1, 1, 1, 1, 0, 3, 3, 3, 3, 0, 1, 1, 1, 1, 1, 1, 3],
	  [0, 1, 0, 0, 0, 0, 1, 0, 5, 3, 3, 5, 0, 1, 0, 0, 0, 0, 1, 0],
	  [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0],
	  [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 0, 1, 0],
	  [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
	  [0, 2, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 2, 0],
	  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];
	
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
	      // } else if (spot === 4) {
	      //   self.grid[j][i] = new Space(options);
	      //   // self.pacman;
	      } else {
	        self.grid[j][i] = new Space(options);
	      }
	    });
	  });
	};
	
	Game.prototype.draw = function (ctx) {
	  var self = this;
	  this.allObjects().forEach(function(spot){
	    spot.draw(ctx);
	  });
	  ctx.font = "24px Arial";
	  ctx.fillStyle = "white";
	
	  ctx.fillText("score:" + this.score,20,20);
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
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.pacman = this.game.pacman;
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
	
	  //every call to animate requests causes another call to animate
	  requestAnimationFrame(this.animate.bind(this));
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
	
	Space.prototype.isAWall = function () {
	  return false;
	};
	module.exports = Space;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map