var NumPattern = [1,2];
var SpeedPattern = ["same","1_higher","2_higher"];
var DirectionPattern = ["same","counter"];
var PlacePattern = ["random","mid","neighbor","apart"];


var speedChoices = [2,2.25,2.5];

var SingleBlackBall

var BlackBallPattern = function(pattern,time)
{
    //依次为数量，速度，方向，位置
    this.pattern = pattern;
    //单位为毫秒   
    this.time = time;
}

var LevelDesign = function(nowLevel)
{
    this.length = 0;
    this.patternList = [];
    this.blackBallList = [];
    this.timeList = [];

    switch(nowLevel)
    {
        case 1:
        {
            this.length = 10;
            for (let j=0;j<this.length;j++)
            {
                this.patternList.push(new BlackBallPattern([1,"same","same","random"],1.5 * (j+1) * 1000));
            }
            break;
        }
        case 2:
        {
            this.length = 20;
            for (let j=0;j<this.length;j++)
            {
                if (j % 3 == 0)
                    this.patternList.push(new BlackBallPattern([1,"same","same","random"],1 * (j+1) * 1000));
                else if (j % 3 == 1)
                    this.patternList.push(new BlackBallPattern([2,"same","same","neighbor"], 1 * (j+1) * 1000));
                else 
                    this.patternList.push(new BlackBallPattern([2,"same","counter","apart"], 1 * (j+1) * 1000));
            }
        }
        case 3:
        {
            this.length = 10;
            for (let j=0;j<this.length;j++)
            {
                if (j % 2 == 0)
                    this.patternList.push(new BlackBallPattern([2,"same","same","neighbor"],1 * (j+1) * 1000));
                else 
                    this.patternList.push(new BlackBallPattern([2,"1_higher","counter","apart"], 1 * (j+1) * 1000));
            }
        }
        case 4:
        {
            this.length = 6;
            this.patternList.push(new BlackBallPattern([2,"same","same","neighbor"], 1 *  1000 ));
            this.patternList.push(new BlackBallPattern([2,"1_higher","same","neighbor"], 2 * 1000));
            this.patternList.push(new BlackBallPattern([2,"2_higher","counter","apart"], 3 * 1000));
            this.patternList.push(new BlackBallPattern([1,"same","same","mid"], 3.5 * 1000));
            this.patternList.push(new BlackBallPattern([2,"1_higher","same","apart"], 4 * 1000));
            this.patternList.push(new BlackBallPattern([2,"same","same","neighbor"], 5 * 1000));
        }
    }

    for (let i=0;i<this.length;i++)
        this.process(i);
}

LevelDesign.prototype.process = function(i)
{
    var place = this.placeRandom(i);
    var direction = this.directionRandom(i);
    var speed = this.speedRandom(i);
            
    this.insertToList(i,place,direction,speed);
}

LevelDesign.prototype.placeRandom = function(i)
{
    // 第一位 0 左右 1 上下
    // 第二位 0 左 1 中 2 右
    switch (this.patternList[i].pattern[3])
    {
        case "random":
        {
            //先随机 0左右 1上下
            var t1 = Math.random() * 2;
            t1 = Math.floor(t1);

            //再随机具体位置
            //1左 2中 3右
            var t2 = Math.random() * 3;
            t2 = Math.ceil(t2);

            return [[t1,t2]];
        }
        case "mid":
        {
            //随机 0左右 1上下
            var t1 = Math.random() * 2;
            t1 = Math.floor(t1);

            return [[t1,2]];
        }
        case "neighbor":
        {
            //随机 0左右 1上下
            var t1 = Math.random() * 2;
            t1 = Math.floor(t1);

            //随机 0左&中 1中&右
            var t2 = Math.random() * 2;
            t2 = Math.floor(t2);

            return [[t1,t2 + 1],[t1,t2 + 2]];
        }
        case "apart":
        {
            //随机 0左右 1上下
            var t1 = Math.random() * 2;
            t1 = Math.floor(t1);

            return [[t1,1],[t1,3]];
        }
    }
}

LevelDesign.prototype.directionRandom = function(i)
{
    switch (this.patternList[i].pattern[2])
    {
        case "same" : 
        {
            //随机方向 0 左/上 1 右/下
            var t1 = Math.random() * 2;
            t1 = Math.floor(t1);

            return [t1];
        }
        case "counter":
        {
            //随机方向 0 左/上 1 右/下
            var t1 = Math.random() * 2;
            t1 = Math.floor(t1);

            return [t1,1-t1];
        }
    }
}

LevelDesign.prototype.speedRandom = function(i)
{
    switch (this.patternList[i].pattern[1])
    {
        case "same":
        {
            return [0,0];
        }
        case "1_higher":
        {
            return [0,1];
        }
        case "2_higher":
        {
            return [0,2];
        }
    }
}

//将第i个pattern中的黑色球信息插入黑色球列表中
LevelDesign.prototype.insertToList = function(i,place,direction,speed)
{
    let len = this.patternList[i].pattern[0];
    //分别处理这Pattern中的每个黑球
    for (let j=0;j<len;j++)
    {
        var bx,by,spx,spy;
        if (direction[j] == 0)// 左/上
        {
            if (place[j][0] == 0)//左
            {
                bx = 0;
                by = roundRectY + (place[j][1] - 0.5) * roundRectSize / K;
                spx = speedChoices[speed[j]];
                spy = 0;
            }
            else //上
            {
                bx = roundRectX + (place[j][1] - 0.5) * roundRectSize / K;
                by = 0;
                spx = 0;
                spy = speedChoices[speed[j]];
            }
        }
        else // 右/下
        {
            if (place[j][0] == 0) //右
            {
                bx = gameWidth;
                by = roundRectY + (place[j][1] - 0.5) * roundRectSize / K;
                spx = -speedChoices[speed[j]];
                spy = 0;
            }
            else //下
            {
                bx = roundRectX + (place[j][1] - 0.5) * roundRectSize / K;
                by = gameHeight;
                spx = 0;
                spy = -speedChoices[speed[j]];
            }
        }
        //插入这个Pattern统一的时间
        this.timeList.push(this.patternList[i].time);
        this.blackBallList.push(new BlackBall(bx,by,spx,spy));
    }
}

