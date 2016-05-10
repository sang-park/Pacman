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
  }
};

module.exports = Wall;
