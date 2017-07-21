var fps = 80;
var K = 3;

var gameX = 0;
var gameY = 0;
var gameWidth = 400;
var gameHeight = 600;

var score = 0;
var bestScore = 0;

var level = 1;
var state = 0;

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

//尝试加载字体
try
{
    var myFontM = new FontFace('Moonlight', 'url(font/Moonlight.ttf)');
    myFontM.load().then(function(font){
    // with canvas, if this is ommited won't work
    document.fonts.add(font);
    console.info('load finish');
    });
}
catch(e)
{

}


var setCanvasArea = function()
{
    let allC = document.getElementsByTagName("canvas");
    for (let i=0;i<allC.length;i++)
    {
        allC[i].width = gameWidth;
        allC[i].height = gameHeight;
    }
}

var calcGamePos = function()
{
    let div = document.getElementById("gameArea");
    gameX = div.scrollLeft || div.offsetLeft;
    gameY = div.scrollTop || div.offsetTop;
}

