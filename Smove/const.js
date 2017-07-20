var fps = 80;
var K = 3;

var gameWidth = 400;
var gameHeight = 600;

var score = 0;
var bestScore = 666;

var level = 1;

//绘制圆角矩形
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y, x+w, y+h, r);
    this.arcTo(x+w, y+h, x, y+h, r);
    this.arcTo(x, y+h, x, y, r);
    this.arcTo(x, y, x+w, y, r);
    this.closePath();
    return this;
}

