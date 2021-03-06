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
