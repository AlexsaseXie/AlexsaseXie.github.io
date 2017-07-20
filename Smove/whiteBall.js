var whiteBallR = 13 * 3/K;
var whiteX = 2;
var whiteY = 2;

//-1可以接受按键输入
var whiteBallMoveTime = -1;
var whiteBallMoveDuration = 2;
var whiteBallReboundDuration = 4;
var whiteBallReboundPercent = 0.2;
var whiteBallMove = [];
whiteBallMove.push(function()
{
    //左
    if (whiteBallMoveTime >= 0 && whiteBallMoveTime < whiteBallMoveDuration)
    {
        clearWhiteBall();
        whiteX -= (1+whiteBallReboundPercent)/whiteBallMoveDuration;
        drawWhiteBall();
    }
    else if (whiteBallMoveTime >= whiteBallMoveDuration && whiteBallMoveTime < whiteBallReboundDuration)
    {
        clearWhiteBall();
        whiteX += whiteBallReboundPercent/(whiteBallReboundDuration - whiteBallMoveDuration);
        drawWhiteBall();
    }
    whiteBallMoveTime ++;
});
whiteBallMove.push(function()
{
    //上
    if (whiteBallMoveTime >= 0 && whiteBallMoveTime < whiteBallMoveDuration)
    {
        clearWhiteBall();
        whiteY -= (1+whiteBallReboundPercent)/whiteBallMoveDuration;
        drawWhiteBall();
    }
    else if (whiteBallMoveTime >= whiteBallMoveDuration && whiteBallMoveTime < whiteBallReboundDuration)
    {
        clearWhiteBall();
        whiteY += whiteBallReboundPercent/(whiteBallReboundDuration - whiteBallMoveDuration);
        drawWhiteBall();
    }
    whiteBallMoveTime ++;
});
whiteBallMove.push(function()
{
    //右
    if (whiteBallMoveTime >= 0 && whiteBallMoveTime < whiteBallMoveDuration)
    {
        clearWhiteBall();
        whiteX += (1+whiteBallReboundPercent)/whiteBallMoveDuration;
        drawWhiteBall();
    }
    else if (whiteBallMoveTime >= whiteBallMoveDuration && whiteBallMoveTime < whiteBallReboundDuration)
    {
        clearWhiteBall();
        whiteX -= whiteBallReboundPercent/(whiteBallReboundDuration - whiteBallMoveDuration);
        drawWhiteBall();
    }
    whiteBallMoveTime ++;
});
whiteBallMove.push(function()
{
    //下
    if (whiteBallMoveTime >= 0 && whiteBallMoveTime < whiteBallMoveDuration)
    {
        clearWhiteBall();
        whiteY += (1+whiteBallReboundPercent)/whiteBallMoveDuration;
        drawWhiteBall();
    }
    else if (whiteBallMoveTime >= whiteBallMoveDuration && whiteBallMoveTime < whiteBallReboundDuration)
    {
        clearWhiteBall();
        whiteY -= whiteBallReboundPercent/(whiteBallReboundDuration - whiteBallMoveDuration);
        drawWhiteBall();
    }
    whiteBallMoveTime ++;
});

function drawWhiteBall()
{
    let whiteBallCanvas = document.getElementById("whiteBall"),whiteBallCtx = whiteBallCanvas.getContext("2d");

    whiteBallCtx.strokeStyle = "#F0FFFF";
    whiteBallCtx.fillStyle = "#F0FFFF";
    
    whiteBallCtx.beginPath();
    whiteBallCtx.arc(roundRectX + (whiteX - 0.5) * roundRectSize / K,roundRectY + (whiteY - 0.5) * roundRectSize/ K,whiteBallR , 0, Math.PI *2,false);
    whiteBallCtx.closePath();
    whiteBallCtx.stroke();
    whiteBallCtx.fill();
}

function clearWhiteBall()
{
    let whiteBallCtx = document.getElementById("whiteBall").getContext("2d");
    whiteBallCtx.clearRect(roundRectX + (whiteX - 0.5) * roundRectSize / K - whiteBallR - 2 , roundRectY + (whiteY - 0.5) * roundRectSize / K - whiteBallR - 2 ,  2 * (whiteBallR+2) , 2 * (whiteBallR+2) );
}