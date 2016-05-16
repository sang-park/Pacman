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
