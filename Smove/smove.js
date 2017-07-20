var roundRectSize = 150;
var roundRectR = 40;
var roundRectX = (gameWidth-roundRectSize)/2;
var roundRectY = (gameHeight-roundRectSize)/2;

//黑球列表
var blackBallList = [new BlackBall(100,100,0.5,0.2),new BlackBall(130,200,1,0.6)];

//得分方块列表
var pointList = [];

//得分文字提示列表
var getPointTextList = [];

//关卡提示信息 Level -
var levelText = new LevelText();




function initBackground()
{
    drawBackground();
    
    return true;
}

function initScore()
{
    drawScore();
    drawBestScore();
}

function initCenter()
{
    let centerCanvas = document.getElementById("center"),centerCtx = centerCanvas.getContext("2d");

    centerCtx.strokeStyle = "grey";
    centerCtx.lineWidth = 4;
    centerCtx.roundRect(roundRectX,roundRectY,roundRectSize,roundRectSize,roundRectR).stroke();
    centerCtx.lineWidth = 2;
    centerCtx.rectLines(roundRectX,roundRectY).stroke();

    return true;
}


var whiteBallMoveMoniter = function()
{
    if (whiteBallMoveTime >= whiteBallReboundDuration)
    {
        //置为可以接受按键
        whiteBallMoveTime = -1;
        clearWhiteBall();
        whiteX = Math.round(whiteX);
        whiteY = Math.round(whiteY);
        drawWhiteBall();
        clearInterval(whiteBallMoveInterval);
    }
}

var blackBallMoveMoniter = function()
{
    //清除画布
    for (var i=0;i<blackBallList.length;i++)
    {
        blackBallList[i].clearTail();
        blackBallList[i].clearBlackBall();
    }

    for (var i=0;i<blackBallList.length;i++)
    {
        blackBallList[i].move();
        //如果移出屏幕就把它删掉
        if (blackBallList[i].blackX > gameWidth + 200 || blackBallList[i].blackX < - 200 || blackBallList[i].blackY > gameHeight + 200 || blackBallList[i].blackY < - 200)
        {
            blackBallList.splice(i,1);
            i = i-1;
        }
    }

    //画下层的尾巴
    for (var i=0;i<blackBallList.length;i++)
    {
        blackBallList[i].drawTail();
    }
    //画上层的黑球
    for (var i=0;i<blackBallList.length;i++)
    {
        blackBallList[i].drawBlackBall();
    }
}

var blackBallListEmptyMoniter = function()
{
    //如果已经没有黑球了，就重新生成一次
    if (levelBlackBallIntervals.length == 0)
    {
        console.log("reload");
        startGenerateBlackBall(0);
    }
}

var pointSpinMoniter = function()
{
    for (var i=0;i<pointList.length;i++)
    {
        pointList[i].spin();
    }
}

var crashMoniter = function()
{
    for (var i=0;i<blackBallList.length;i++)
    {
        var bx = blackBallList[i].blackX;
        var by = blackBallList[i].blackY;
        var wx = roundRectX + (whiteX - 0.5) * roundRectSize / K;
        var wy = roundRectY + (whiteY - 0.5) * roundRectSize / K;
        if (Math.sqrt((bx-wx)*(bx-wx) + (by-wy)*(by-wy)) < (blackBallList[i].R + whiteBallR))
        {
            clearInterval(mainInterval);
            mainInterval = null;
            clearInterval(whiteBallMoveInterval);
            clearInterval(levelTextInterval);
        }
    }
}

var getPointMoniter = function()
{
    for (var i=0;i<pointList.length;i++)
    {
        if (pointList[i].pointX == whiteX && pointList[i].pointY == whiteY)
        {
            pointList[i].clearPoint();
            //创建一个+1提示
            getPointTextList.push(new PlusText(pointList[i].pointX,pointList[i].pointY,pointList[i].type));
            //如果这个得分块是红色的 关卡数+1
            if (pointList[i].type == 1)
                levelUpDoThings();
            //插入一个新的得分块
            else 
                generateNewPoint();
            //删掉这个得分块
            pointList.splice(i,1);
            i = i-1;
            //分数+1 
            score ++;
            //重绘上方的分数提示
            clearScore();
            drawScore();
        }
    }
}

var getPointTextMoniter = function()
{
    for (var i=0;i<getPointTextList.length;i++)
    {
        getPointTextList[i].goUp();
        if (getPointTextList[i].fadeFrame >= maxFadeFrame)
        {
            getPointTextList[i].clearText();
            getPointTextList.splice(i,1);
            i=i-1;
        }
    }
}

var levelTextMoniter = function()
{
    if (levelText.currentFrame >= levelShowFrame * 2)
    {
        levelText.currentAlpha = 0;
        levelText.currentFrame = 0;
        levelText.clearLevel();
        clearInterval(levelTextInterval);
    }
}

var levelTextUpdate = function()
{
    levelText.showLevel();
}

var levelUpDoThings = function()
{
    level ++;
    clearBlackBalls();
    levelTextInterval = setInterval(levelTextUpdate,1000/fps);
    startChangeBackground();
    startGenerateBlackBall(changeBackgroundTimeScale);
    generateNewPoint(changeBackgroundTimeScale);
}

//白球移动的计时器
var whiteBallMoveInterval;
//升级消息的计时器
var levelTextInterval;

function update()
{
    //更新白球的移动状态
    whiteBallMoveMoniter();
    //黑球移动
    blackBallMoveMoniter();
    //撞击
    crashMoniter();
    //得分块旋转
    pointSpinMoniter();
    //吃到得分块
    getPointMoniter();
    //吃到得分块的“+1”提示
    getPointTextMoniter();
    //显示关卡信息
    levelTextMoniter();
    //如果黑球没有了 重新加载一遍此关
    blackBallListEmptyMoniter();
}

//主计时器
var mainInterval;

//绘制中间的分割线
CanvasRenderingContext2D.prototype.rectLines = function(x,y){
    this.beginPath();
    for (var i=1;i<K;i++)
    {
        this.moveTo(x+i * roundRectSize/K,y+10);
        this.lineTo(x+i * roundRectSize/K,y+roundRectSize-10);
    }
    
    for (var i=1;i<K;i++)
    {
        this.moveTo(x+10,y+ i * roundRectSize/K);
        this.lineTo(x+roundRectSize-10,y+ i * roundRectSize/K);
    }
    
    this.closePath();
    return this;
}


//处理按键的事件
function dealKeyEvent()
{
    if (whiteBallMoveTime != -1 || mainInterval == null)
        return;
    switch(event.keyCode)
    {
        case 37:
        {
            //左
            if (whiteX > 1)
            {
                whiteBallMoveTime = 0;
                whiteBallMoveInterval = setInterval(whiteBallMove[0],1000/fps);
            }
            break;
        }
        case 38:
        {
            //上
            if (whiteY > 1)
            {
                whiteBallMoveTime = 0;
                whiteBallMoveInterval = setInterval(whiteBallMove[1],1000/fps);
            }
            break;
        }
        case 39:
        {
            //右
            if (whiteX < K)
            {
                whiteBallMoveTime = 0;
                whiteBallMoveInterval = setInterval(whiteBallMove[2],1000/fps);
            }
            break;
        }
        case 40:
        {
            //下
            if (whiteY < K)
            {
                whiteBallMoveTime = 0;
                whiteBallMoveInterval = setInterval(whiteBallMove[3],1000/fps);
            }
            break;
        }
    }
}


//产生这一关的信息
var levelD;

//当前还待产生的黑球的列表
var levelBlackBallIntervals = [];

console.log(levelBlackBallIntervals);


//产生黑色小球
var startGenerateBlackBall = function(waitScale)
{
    levelD = new LevelDesign(level);
    for (var i=0;i<levelD.blackBallList.length;i++)
    {
        var iInterval = setTimeout(_generateOneBlackBall(i),levelD.timeList[i] + waitScale);
        levelBlackBallIntervals.push(iInterval);
    }
}

var generateOneBlackBall = function(i)
{
    blackBallList.push(levelD.blackBallList[i]);
    levelBlackBallIntervals.shift();
}
var _generateOneBlackBall = function(i)
{
    return function(){generateOneBlackBall(i);};
}


//到达下一关时 清空尚未产生的黑球
var clearBlackBalls = function()
{
    for(var i=0;i<levelBlackBallIntervals.length;i++)
    {
        clearInterval(levelBlackBallIntervals[i]);
        levelBlackBallIntervals.splice(i,1);
        i--;
    }
}


function init()
{
    //显示背景
    initBackground();
    //显示中间的游戏区域
    initCenter();
    //显示分数
    initScore();
    //显示白球
    drawWhiteBall();

    //启动主计时器
    mainInterval = setInterval(update,1000/fps);
    //显示关卡信息
    levelTextInterval = setInterval(levelTextUpdate,1000/fps);

    //插入第一个得分块
    generateNewPoint(0);

    //开始关卡设计
    startGenerateBlackBall(0);
}


//产生新的得分块
var generatePointIndex = 0;
var generateNewPoint = function(waitTime)
{
    setTimeout(_generatePoint(),waitTime);
}

var generatePoint = function()
{
    generatePointIndex += 1;
    let wx = Math.round(whiteX);
    let wy = Math.round(whiteY);
    let i,j;
    let point = [];
    //把距离>1的点插入候选
    for (i=1;i<=K;i++)
    {
        for (j=1;j<=K;j++)
        {
            if (Math.abs(i-wx) + Math.abs(j-wy) > 1)
                point.push([i,j]);
        }
    }
    //随机选出候选中的一个
    let t = Math.random() * point.length;
    t = Math.floor(t);

    let type = 0;
    if (generatePointIndex == 10)
    {
        type = 1;
        generatePointIndex = 0;
    }
    var tmp = new Point(point[t][0],point[t][1],type); 
    pointList.push(tmp);
}
var _generatePoint = function()
{
    return function(){generatePoint();};
}