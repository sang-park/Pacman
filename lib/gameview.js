var Game = require('./game');
var Sound = require('./sound');

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
