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

  key("m", function(){
    this.mute = !this.mute;
    // Sound.toggleSound();
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


  // this.openingSound.play();

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
