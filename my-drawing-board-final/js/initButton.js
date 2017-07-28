////由田宇创建
//设置按钮事件
document.getElementById("pencil").onclick = function(){
    clearChooseButton();
    canvas.pencil();
    previousChooseButton.push(this);
}

document.getElementById("bucket").onclick = function(){
    clearChooseButton();
    canvas.fill();
    previousChooseButton.push(this);
}

document.getElementById("text").onclick = function(){
    clearChooseButton();
    canvas.text();
    previousChooseButton.push(this);
}

document.getElementById("clear").onclick = function(){
    clearChooseButton();
    canvas.controlCanvas("clear");
    previousChooseButton.push(this);
}

document.getElementById("eraser").onclick = function(){
    clearChooseButton();
    canvas.eraser0();
    previousChooseButton.push(this);
}

document.getElementById("changesize").onclick = function(){
    clearChooseButton();
    canvas.changeSize();
    previousChooseButton.push(this);
    //重新设置div的大小
    canvasResize();
}

//在已有图片基础上画
document.getElementById("open").onchange = function(){
    clearChooseButton();
    canvas.open();
}

document.getElementById("save").onclick = function(){
    clearChooseButton();
    canvas.save();
}

document.getElementById("previous").onclick = function(){
    canvas.controlCanvas('previous');
}

document.getElementById("next").onclick = function(){
    canvas.controlCanvas('next');
}

//清空鼠标事件
canvas.clearCanvasMouseEvent();
