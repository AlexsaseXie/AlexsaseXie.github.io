'use strict'
function drawBestScore()
{
    var canvas = document.getElementById("score"),
        ctx = canvas.getContext("2d"); 
    //绘制得分数
    ctx.font = 'bold ' + 20 * viewRate +'px Moonlight';
    ctx.textAlign = 'left';
    ctx.textBaseLine = 'top';
    ctx.fillStyle = '#F0FFFF';
    ctx.fillText('Best Score:' + bestScore ,20 * viewRate,40 *viewRate);
}

function clearBestScore()
{
    var canvas = document.getElementById("score"),
        ctx = canvas.getContext("2d"); 
    //清除得分数
    ctx.clearRect(20 * viewRate,10 * viewRate,200 * viewRate,20 * viewRate); 
}

function drawScore()
{
    var canvas = document.getElementById("score"),
        ctx = canvas.getContext("2d"); 
    //绘制得分数
    ctx.font = 'bold '+50 * viewRate +'px Moonlight';
    ctx.textAlign = 'left';
    ctx.textBaseLine = 'top';
    ctx.fillStyle = '#F0FFFF';
    ctx.fillText(score ,20 * viewRate,100 * viewRate);
}

function clearScore()
{
    var canvas = document.getElementById("score"),
        ctx = canvas.getContext("2d"); 
    //清除得分数
    ctx.clearRect(20 * viewRate,50 * viewRate,200 * viewRate,(50 + 5) * viewRate );
}

var levelShowFrame = 80;

var LevelText = function()
{
    this.currentFrame = 0;
    this.currentAlpha = 0;
}

LevelText.prototype.showLevel = function()
{
    this.clearLevel();
    if (this.currentFrame < levelShowFrame)
    {
        this.currentFrame += 1;
        this.currentAlpha += 1/levelShowFrame;
    }
    else if (this.currentFrame < levelShowFrame * 2)
    {
        this.currentFrame += 1;
        this.currentAlpha -= 1/levelShowFrame;
        if (this.currentAlpha < 0)
            this.currentAlpha = 0;
    }
    this.drawLevel();
}

LevelText.prototype.drawLevel = function()
{
    var canvas = document.getElementById("score"),
        ctx = canvas.getContext("2d"); 
    //绘制Level提示信息
    ctx.save();

    ctx.globalAlpha = this.currentAlpha;
    ctx.font = 'bold '+20 * viewRate +'px Moonlight';
    ctx.textAlign = 'left';
    ctx.textBaseLine = 'top';
    ctx.fillStyle = "#F0FFFF";
    ctx.fillText("Level "+level,roundRectX + 40 * viewRate ,roundRectY - 10 * viewRate);

    ctx.restore();
}

LevelText.prototype.clearLevel = function()
{
    var canvas = document.getElementById("score"),
        ctx = canvas.getContext("2d"); 

    ctx.clearRect(roundRectX,roundRectY - 10 * viewRate - 20 * viewRate ,200 * viewRate, (20 + 5) * viewRate);
}