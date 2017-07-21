'use strict'
var frontCoverRectX,frontCoverRectY,frontCoverRectWidth,frontCoverRectHeight;
var backCoverRectX,backCoverRectY,backCoverRectWidth,backCoverRectHeight; 

var drawFrontCover = function()
{
    var canvas = document.getElementById("cover"),
        ctx = canvas.getContext("2d");        

    //绘制背景
    var divisionY = gameHeight * rate;

    var index = (1 + backgroundColorList.length - 1) % backgroundColorList.length;
    var preIndex = (1 + backgroundColorList.length - 2) % backgroundColorList.length;
    console.log(index,preIndex);

    //纯色区域
    ctx.fillStyle = backgroundColorList[index];
    ctx.fillRect(0,0,gameWidth,divisionY);

    //线性渐变区域
    var lGrd = ctx.createLinearGradient(gameWidth/2,divisionY,gameWidth/2,gameHeight);
    lGrd.addColorStop(0,backgroundColorList[index]);
    lGrd.addColorStop(1,backgroundColorList[preIndex]);
    ctx.fillStyle = lGrd;
    ctx.fillRect(0,divisionY,gameWidth,gameHeight - divisionY);

    ctx.font = 'bold '+60 * viewRate +'px Moonlight';
    var title = "SMOVE";

    //Smove字样外面的圆角矩形
    ctx.strokeStyle = "#F0FFFF";
    ctx.lineWidth = 4;
    frontCoverRectX = (gameWidth - ctx.measureText(title).width - 80 * viewRate) / 2 ;
    frontCoverRectY = (gameHeight + (60 - 40 - 60 - 80) * viewRate) / 2 ;
    frontCoverRectWidth =  (ctx.measureText(title).width + 80 * viewRate) ;
    frontCoverRectHeight =  (60 + 80/2) * viewRate;
    ctx.roundRect(frontCoverRectX, frontCoverRectY, frontCoverRectWidth, frontCoverRectHeight, 50 * viewRate).stroke();


    //中间的Smove 字样
    ctx.textAlign = 'left';
    ctx.textBaseLine = 'top';
    ctx.fillStyle = "#F0FFFF";

    ctx.fillText(title,(gameWidth - ctx.measureText(title).width)/2 ,(gameHeight + (60 - 40) * viewRate)/2) ;

    return true;
}

var clearFrontCover = function()
{
    var canvas = document.getElementById("cover"),
        ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,gameWidth,gameHeight);
}

var imageData;

var pickGameArea = function()
{
    //绘制背景
    //拾取当前游戏区域的RGB值
    var imageDataTmp;
    var allC = document.getElementsByTagName("canvas");
    for (var i=0;i<allC.length;i++)
    {
        if (allC[i].id == "cover")
            continue;
        if (i==0)
            imageData = allC[i].getContext("2d").getImageData(0,0,gameWidth,gameHeight);
        else
        {
            imageDataTmp = allC[i].getContext("2d").getImageData(0,0,gameWidth,gameHeight);
            for (var j=0;j<imageDataTmp.data.length;j +=4)
            {
                if ( imageDataTmp.data[j+3] != 0)
                {
                    imageData.data[j] = imageDataTmp.data[j];
                    imageData.data[j+1] = imageDataTmp.data[j+1];
                    imageData.data[j+2] = imageDataTmp.data[j+2];
                    imageData.data[j+3] = imageDataTmp.data[j+3];
                }
            }
        }
    }
}

var lock = false;
var blurDuration = 5000;
var blurR = 0;
var maxBlurR = 30;
var blurInterval;

var drawBackCover = function()
{
    var canvas = document.getElementById("cover"),
        ctx = canvas.getContext("2d");

    var preCanvas = document.getElementById("preCover"),
    preCtx = preCanvas.getContext("2d");

    //获取游戏区域的内容
    if (lock == false)
    {
        pickGameArea();
        lock = true;
    }
    //绘制当前游戏区域
    preCtx.putImageData(imageData,0,0);

    //绘制一张纯色背景
    preCtx.save();
    preCtx.globalAlpha = 0.6;
    preCtx.fillStyle = "grey";
    preCtx.fillRect(0,0,gameWidth,gameHeight);

    //模糊处理
    processCanvasRGB(preCanvas , 0, 0, gameWidth, gameHeight, blurR);

    preCtx.restore(); 

    ctx.font = 'bold '+60 * viewRate +'px Moonlight';
    ctx.textAlign = 'left';
    ctx.textBaseLine = 'top';
    ctx.fillStyle = "#F0FFFF";

    //绘制得分
    var title = score+"";
    ctx.fillText(title,(gameWidth - ctx.measureText(title).width)/2 ,(gameHeight + (60 - 40) * viewRate)/2 - 100 * viewRate);

    title = "GAME OVER";
    //绘制GAME OVER
    ctx.fillText(title,(gameWidth - ctx.measureText(title).width)/2 ,(gameHeight + (60 - 40) * viewRate)/2 - 40 * viewRate);

    //绘制Restart字样外面的圆角矩形
    title = "Restart"
    ctx.font = 'bold '+40 * viewRate+'px Moonlight';

    ctx.strokeStyle = "#F0FFFF";
    ctx.lineWidth = 4;
    backCoverRectX = (gameWidth - ctx.measureText(title).width - 80 * viewRate) / 2;
    backCoverRectY = (gameHeight + (40 - 40 - 40 - 80)* viewRate) / 2 + 45 * viewRate;
    backCoverRectWidth =  ctx.measureText(title).width + 80 * viewRate;
    backCoverRectHeight =  (40 + 80/2) * viewRate;
    ctx.roundRect(backCoverRectX, backCoverRectY, backCoverRectWidth, backCoverRectHeight, 40 * viewRate).stroke();

    //绘制Restart字样
    ctx.fillText(title,(gameWidth - ctx.measureText(title).width)/2, (gameHeight + (40 - 40) * viewRate)/2 + 40 * viewRate);
}

var clearBackCover = function()
{
    var ctx = document.getElementById("cover").getContext("2d");
    var preCtx = document.getElementById("preCover").getContext("2d");

    ctx.clearRect(0,0,gameWidth,gameHeight);
    preCtx.clearRect(0,0,gameWidth,gameHeight);
}

var blurBackCover = function()
{
    clearBackCover();
    if (blurR < maxBlurR)
        blurR += (maxBlurR/blurDuration) * (1000/fps);
    drawBackCover();
}

var startDrawBackCover = function()
{
    blurInterval = setInterval(blurBackCover,1000/fps);
}


//处理鼠标点击的事件
function dealMouseUpEvent()
{   
    console.log("clicked!",gameX,gameY);
    if (state == 0)
    {
        var mx = event.clientX - gameX;
        var my = event.clientY - gameY;
        console.log('x:',mx,'y:',my);
        if ( mx >= frontCoverRectX && mx <= frontCoverRectX + frontCoverRectWidth && my >= frontCoverRectY && my <= frontCoverRectY + frontCoverRectHeight )
        {
            clearFrontCover();
            state = 1;
            init();
        }
    }

    else if (state == 2)
    {
        var mx = event.clientX - gameX;
        var my = event.clientY - gameY;
        if ( mx >= backCoverRectX && mx <= backCoverRectX + backCoverRectWidth && my >= backCoverRectY && my <= backCoverRectY + backCoverRectHeight )
        {
            //如果成绩更好，更新最佳记录
            if (score > bestScore)
                bestScore = score;
            //清除模糊相关变量
            lock = false;
            clearInterval(blurInterval);
            blurR = 0;
            //清空backCover
            clearBackCover();
            clearAll();
            state = 1;
            init();
        }
    }
}