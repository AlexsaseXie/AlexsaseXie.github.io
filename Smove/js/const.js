'use strict'
var fps = 80;
var K = 3;

var viewRate = 1;

//处理手机端的缩放问题
var u = navigator.userAgent;
var m1 = u.match("Mobile")
var m2 = u.match("mobile")  //是否为移动终端
if (m1 || m2)
{
    console.log(m1,m2);
    console.log("IsMobile!");
    viewRate = document.documentElement.clientWidth / 400;
}

var gameX = 0;
var gameY = 0;
var gameWidth = Math.round(400 * viewRate);
var gameHeight = Math.round(600 * viewRate);

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



    var div = document.getElementById("gameArea");
    div.style.top = (document.documentElement.clientHeight - gameHeight) / 2 +"px";
    div.style.left = (document.documentElement.clientWidth - gameWidth) / 2 +"px";
    div.style.width = gameWidth + "px";
    div.style.height = gameHeight + "px";

    console.log(document.documentElement.clientWidth,document.documentElement.clientHeight)
    console.log(div.style.width,div.style.height);
    var allC = document.getElementsByTagName("canvas");
    for (var i=0;i<allC.length;i++)
    {
        allC[i].width = gameWidth;
        allC[i].height = gameHeight;
    }

}

var calcGamePos = function()
{
    var div = document.getElementById("gameArea");
    gameX = div.scrollLeft || div.offsetLeft;
    gameY = div.scrollTop || div.offsetTop;
}

