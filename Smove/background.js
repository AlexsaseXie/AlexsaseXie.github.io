var backgroundColorList = ["#EEEE00","#AEEEEE","#C0FF3E","#98F5FF","#FFBBFF"];
var rate = 3/5;

var drawBackground = function()
{
    let canvas = document.getElementById("background"),
        ctx = canvas.getContext("2d");        

    //绘制背景
    var divisionY = gameHeight * rate;

    var index = (level + backgroundColorList.length - 1) % backgroundColorList.length;
    var preIndex = (level + backgroundColorList.length - 2) % backgroundColorList.length;
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
    
    return true;
}

var changeBackgroundInterval;
var changeBackgroundTimeScale = 3000;
var changeBackCurrentScale = 0;

var moveSpeed = (gameHeight/changeBackgroundTimeScale) * (1000/fps) ;

var upDivision = - gameHeight * rate;
var downDivision = gameHeight * (1-rate);

var startChangeBackground = function()
{   
    //设置背景滚动计时器
    changeBackgroundInterval = setInterval(changeBackground,1000/fps);
    //滚动完后清除计时器
    setTimeout(endChangeBackground,changeBackgroundTimeScale);
}

var endChangeBackground = function()
{
    changeBackCurrentScale = 0;

    upDivision = - gameHeight * rate;
    downDivision = gameHeight * (1-rate);
    clearInterval(changeBackgroundInterval);
    //确认一下背景绘制正确
    drawBackground();
}


var changeBackground = function()
{
    changeBackCurrentScale += 1000/fps;

    upDivision += moveSpeed;
    downDivision += moveSpeed;
    console.log(upDivision);

    var index = (level + backgroundColorList.length - 1) % backgroundColorList.length;
    var preIndex = (level + backgroundColorList.length - 2) % backgroundColorList.length;
    var ppreIndex = (level + backgroundColorList.length - 3) % backgroundColorList.length;

    let ctx = document.getElementById("background").getContext("2d");
    //下方的渐变区域还未划出屏幕
    if (downDivision <= gameHeight)
    {
        //画上面的渐变区域
        var lGrd = ctx.createLinearGradient(gameWidth/2,upDivision,gameWidth/2,upDivision + gameHeight * rate);
        lGrd.addColorStop(0,backgroundColorList[index]);
        lGrd.addColorStop(1,backgroundColorList[preIndex]);
        ctx.fillStyle = lGrd;
        ctx.fillRect(0,0,gameWidth,upDivision + gameHeight * rate);

        //画下面的纯色区域
        ctx.fillStyle = backgroundColorList[preIndex];
        ctx.fillRect(0,downDivision-moveSpeed,gameWidth,moveSpeed);

        //画下面的渐变区域
        lGrd = ctx.createLinearGradient(gameWidth/2,downDivision,gameWidth/2,downDivision + gameHeight * rate);
        lGrd.addColorStop(0,backgroundColorList[preIndex]);
        lGrd.addColorStop(1,backgroundColorList[ppreIndex]);
        ctx.fillStyle = lGrd;
        ctx.fillRect(0,downDivision,gameWidth,gameHeight - downDivision);
    }
    else
    {
        //画上面的纯色区域
        ctx.fillStyle = backgroundColorList[index];
        ctx.fillRect(0,0,upDivision - moveSpeed,upDivision);

        //画上面的渐变区域
        var lGrd = ctx.createLinearGradient(gameWidth/2,upDivision,gameWidth/2,upDivision + gameHeight * rate);
        lGrd.addColorStop(0,backgroundColorList[index]);
        lGrd.addColorStop(1,backgroundColorList[preIndex]);
        ctx.fillStyle = lGrd;
        ctx.fillRect(0,upDivision,gameWidth,upDivision + gameHeight * rate);
    }
}