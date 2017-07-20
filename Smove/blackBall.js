var blackBallR = 16 * 3/K;


var tailNum = 4;
var tailDistance = 20;
var tailR = 4;
var tailWidth = tailDistance * tailNum + tailR + 15;

    
var BlackBall = function(X,Y,speedX,speedY)
{
    this.blackX = X;
    this.blackY = Y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.R = blackBallR;
}

BlackBall.prototype.move = function()
{
    //this.clearBlackBall()
    this.blackX += this.speedX;
    this.blackY += this.speedY;
    //this.drawBlackBall();
}

BlackBall.prototype.drawBlackBall = function()
{ 
    //this.drawTail();
    
    let blackBallCtx = document.getElementById("blackBall").getContext("2d");

    blackBallCtx.strokeStyle = "black";
    blackBallCtx.fillStyle = "black";
    
    blackBallCtx.beginPath();
    blackBallCtx.arc(this.blackX , this.blackY, this.R , 0 , Math.PI *2,false);
    blackBallCtx.closePath();
    blackBallCtx.stroke();
    blackBallCtx.fill();

}

BlackBall.prototype.clearBlackBall = function()
{
    //this.clearTail();
    let blackBallCtx = document.getElementById("blackBall").getContext("2d");
    blackBallCtx.clearRect(this.blackX - this.R - 2 , this.blackY - this.R - 2 ,  2 * (this.R+2) , 2 * (this.R+2) );

}

BlackBall.prototype.drawTail = function()
{
    let blackBallCtx = document.getElementById("blackBall").getContext("2d");

    blackBallCtx.save();

    blackBallCtx.translate(this.blackX,this.blackY);
    if (this.speedY != 0)
        blackBallCtx.rotate(Math.atan(this.speedY/this.speedX));
    else
        blackBallCtx.rotate(this.speedX > 0? 0 : Math.PI);
    
    blackBallCtx.strokeStyle = "grey";
    blackBallCtx.fillStyle = "grey";
    for (var i=1;i<=tailNum;i++)
    {
        blackBallCtx.globalAlpha = 1-i*0.2;
        blackBallCtx.beginPath();
        blackBallCtx.arc(-this.R-tailR-5-(i-1)* tailDistance,0,tailR,0,Math.PI *2,false);
        blackBallCtx.closePath();
        blackBallCtx.stroke();
        blackBallCtx.fill();
    }
    blackBallCtx.restore();
}

BlackBall.prototype.clearTail = function()
{
    let blackBallCtx = document.getElementById("blackBall").getContext("2d");

    blackBallCtx.save();

    blackBallCtx.translate(this.blackX,this.blackY);
    if (this.speedY != 0)
        blackBallCtx.rotate(Math.atan(this.speedY/this.speedX));
    else
        blackBallCtx.rotate(this.speedX > 0? 0 : Math.PI);
    
    blackBallCtx.clearRect(-this.R-tailWidth-1,-tailR-1,tailWidth +2,tailR * 2+2);

    blackBallCtx.restore();
}