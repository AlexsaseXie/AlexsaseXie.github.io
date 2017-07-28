//油漆桶工具
function fill() {
    canvas.onmousedown = function (e) {
        var startX = e.pageX - canvas.offsetLeft;
        var startY = e.pageY - canvas.offsetTop;
        fillData(startX, startY);
    }
}

var leftX, rightX, topY, bottomY, leftData, rightData, topData, bottomData;
var tmp = "0,0,0,0";

class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function fillData(startX, startY) {
    //四个方向的颜色
    topData = ctx.getImageData(startX, startY - 1, 1, 1).data.slice(0, 4).toString();
    bottomData = ctx.getImageData(startX, startY + 1, 1, 1).data.slice(0, 4).toString();
    leftData = ctx.getImageData(startX - 1, startY, 1, 1).data.slice(0, 4).toString();
    rightData = ctx.getImageData(startX + 1, startY, 1, 1).data.slice(0, 4).toString();

    var s = new Array; //基准点集合
    s.push(new point(startX, startY));
    fillline(s[0]);

    var p = new point;
    var sX;

    //通过基准点，基于扫描线的泛洪填充
    while (s.length > 0) {
        //初始化
        sX = s[s.length - 1].x;
        topY = s.pop().y;
        bottomY = topY;
        p = (0, 0);
        topData = ctx.getImageData(sX, topY - 1, 1, 1).data.slice(0, 4).toString();
        bottomData = ctx.getImageData(sX, bottomY + 1, 1, 1).data.slice(0, 4).toString();

        //向上扫描
        while (topData === tmp && topY > 0) {
            topY--;
            topData = ctx.getImageData(sX, topY - 1, 1, 1).data.slice(0, 4).toString();
            p = fillline(new point(sX, topY));
        }
        //添加新的基准点
        for (var i = p.x; i < p.y; i++) {
            s.push(new point(i, topY));
        }

        //向下扫描
        while (bottomData === tmp && bottomY < canvas.height) {
            bottomY++;
            bottomData = ctx.getImageData(sX, bottomY + 1, 1, 1).data.slice(0, 4).toString();
            p = fillline(new point(sX, bottomY));
        }
        //添加新的基准点
        for (var i = p.x; i < p.y; i++) {
            s.push(new point(i, bottomY));
        }
    }
}

//传入基准点，填充扫描线
function fillline(p) {
    leftX = p.x;
    rightX = p.x;

    while (leftData === tmp && leftX > 0) {
        leftX--;
        leftData = ctx.getImageData(leftX - 1, p.y, 1, 1).data.slice(0, 4).toString();
    }
    while (rightData === tmp && rightX < canvas.width) {
        rightX++;
        rightData = ctx.getImageData(rightX + 1, p.y, 1, 1).data.slice(0, 4).toString();
    }

    ctx.fillRect(leftX, p.y, rightX - leftX + 1, 1);
    leftData = "0,0,0,0";
    rightData = "0,0,0,0";
    return new point(leftX, rightX);
}