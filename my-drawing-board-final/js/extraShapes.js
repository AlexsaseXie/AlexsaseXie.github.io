////由谢运帷创建
//绘制椭圆
CanvasRenderingContext2D.prototype.ellipse = function (x, y, a, b) {
    this.save();
    var r = (a > b) ? a : b;
    var ratioX = a / r;
    var ratioY = b / r;
    this.scale(ratioX, ratioY);
    this.beginPath();
    this.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
    this.closePath();
    this.restore();
    return this;
};