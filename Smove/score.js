function drawBestScore()
{
    let canvas = document.getElementById("score"),
        ctx = canvas.getContext("2d"); 
    //绘制得分数
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseLine = 'top';
    ctx.fillStyle = 'brown';
    ctx.fillText('Best Score:' + bestScore ,20,40);
}

function clearBestScore()
{
    let canvas = document.getElementById("score"),
        ctx = canvas.getContext("2d"); 
    //清除得分数
    ctx.clearRect(20,10,200,20); 
}

function drawScore()
{
    let canvas = document.getElementById("score"),
        ctx = canvas.getContext("2d"); 
    //绘制得分数
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseLine = 'top';
    ctx.fillStyle = 'brown';
    ctx.fillText(score ,20,90);
}

function clearScore()
{
    let canvas = document.getElementById("score"),
        ctx = canvas.getContext("2d"); 
    //清除得分数
    ctx.clearRect(20,50,200,50);
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
    let canvas = document.getElementById("score"),
        ctx = canvas.getContext("2d"); 
    //绘制Level提示信息
    ctx.save();

    ctx.globalAlpha = this.currentAlpha;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseLine = 'top';
    ctx.fillStyle = "brown";
    ctx.fillText("Level "+level,roundRectX + 40,roundRectY - 10);

    ctx.restore();
}

LevelText.prototype.clearLevel = function()
{
    let canvas = document.getElementById("score"),
        ctx = canvas.getContext("2d"); 

    ctx.clearRect(roundRectX,roundRectY - 10 - 20,200,20);
}