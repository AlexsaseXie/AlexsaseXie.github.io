'use strict'
var pointRectSize = 12 * viewRate;
var pointRectR = 3 * viewRate;
var growSpeed = 1.5 * pointRectSize / (1000/fps) * viewRate;
var spinSpeed = 20.0 / (1000/fps);

var Point = function(X,Y,type)
{
    this.pointX = X;
    this.pointY = Y;
    this.size = 0;
    this.currentArg = 0;
    this.growSpeed = growSpeed;
    this.spinSpeed = spinSpeed;
    this.type = type || 0;
}

Point.prototype.spin = function()
{
    this.clearPoint();
    if (this.size < pointRectSize)
        this.size += this.growSpeed;
    this.currentArg += this.spinSpeed;
    this.drawPoint();
}

Point.prototype.drawPoint = function()
{
    var pointCtx = document.getElementById("point").getContext("2d");

    if (this.type == 0)
    {
        pointCtx.strokeStyle = "blue";
        pointCtx.fillStyle = "blue";
    }
    else
    {
        pointCtx.strokeStyle = "red";
        pointCtx.fillStyle = "red";
    }

    pointCtx.save();

    pointCtx.translate(roundRectX + (this.pointX - 0.5) * roundRectSize / K, roundRectY + (this.pointY - 0.5) * roundRectSize / K);
    pointCtx.rotate(this.currentArg * Math.PI/180);

    pointCtx.roundRect(-this.size/2,-this.size/2,this.size,this.size,pointRectR).stroke();
    
    pointCtx.fill();

    pointCtx.restore();
}

Point.prototype.clearPoint = function()
{
    var pointCtx = document.getElementById("point").getContext("2d");

    pointCtx.save();

    pointCtx.translate(roundRectX + (this.pointX - 0.5) * roundRectSize / K, roundRectY + (this.pointY - 0.5) * roundRectSize / K);
    pointCtx.rotate(this.currentArg * Math.PI/180);

    pointCtx.clearRect(-this.size/2 - 1 , -this.size/2 - 1 , this.size + 2, this.size + 2);

    pointCtx.restore();
}

var maxUpHeight = 10 * viewRate;
var maxFadeFrame = fps / 2;
var fontSize = 20 * viewRate;

var PlusText = function(X,Y,type)
{
    this.posX = roundRectX + (X - 0.5) * roundRectSize / K - fontSize / 2;
    this.posY = roundRectY + (Y - 0.5) * roundRectSize / K - pointRectSize / 2;
    this.moveSpeed = 0.5;
    this.upHeight = 0;
    this.type = type || 0;
    this.fillStyle = this.type == 0 ? 'blue':'red';
    this.currentAlpha = 0;
    this.fadeFrame = 0;
}

PlusText.prototype.goUp = function()
{
    this.clearText();
    if (this.upHeight < maxUpHeight)
    {
        this.posY -= this.moveSpeed;
        this.upHeight += this.moveSpeed;
        this.currentAlpha += 1 / (maxUpHeight / this.moveSpeed);
    }
    else if (this.fadeFrame < maxFadeFrame)
    {
        this.fadeFrame += 1;
        this.currentAlpha -= 1 / maxFadeFrame;
    }
    this.drawText();
}

PlusText.prototype.drawText = function()
{
    var ctx = document.getElementById("point").getContext("2d");
    //绘制+1
    ctx.font = 'bold '+ fontSize +'px Moonlight';
    ctx.save();

    ctx.textAlign = 'left';
    ctx.textBaseLine = 'top';
    ctx.fillStyle = this.fillStyle;
    ctx.globalAlpha = this.currentAlpha;
    ctx.fillText('+1',this.posX,this.posY);

    ctx.restore();
}

PlusText.prototype.clearText = function()
{
    var ctx = document.getElementById("point").getContext("2d");
    //清除+1
    ctx.clearRect(this.posX,this.posY - 20 * viewRate, 40 * viewRate , (20 + 5) * viewRate);
}

