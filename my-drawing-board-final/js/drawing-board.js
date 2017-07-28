////由谢运帷创建
//按钮的颜色
var buttonAutoColor = "#AEEEEE";
var buttonSelectedColor = "#7EC0EE";
var buttonBorderAutoColor = "#FFFFFF";
var buttonBorderSelectedColor = "blue";

//之前选择的按钮
var previousChooseButton = [];

//清除之前选择的按钮
var clearChooseButton = function(){
    canvas.clearCanvasMouseEvent();
    if (previousChooseButton.length > 0)
    {
        previousChooseButton[0].style.backgroundColor = buttonAutoColor; 
        previousChooseButton[0].style.borderColor = buttonBorderAutoColor; 
        previousChooseButton.shift();
    }
}

//处理按键事件
var handleKeyEvent = function(e)
{
    switch(e.keyCode)
    {
        case 37:
        {
            canvas.controlCanvas('previous');
            break;
        }
        case 39:
        {
            canvas.controlCanvas('next');
            break;
        }
    }
};

//设置包裹canvas的div的大小
var canvasResize = function()
{
    //改变包裹元素的大小
    canvas.$el.style.width = canvas.canvasWidth + "px";
    canvas.$el.style.height = canvas.canvasHeight + "px";
}

//左边工具栏区域
var leftToolBar = new Vue({
    el: '#leftToolBar',
    data:{
        closed : false,
        shapeTools : ["Line","Rect","Ellipse","Triangle"],
        shapeToolHint : ["线段","矩形","椭圆","三角形"],
        lineWidthChoices : [1,3,5,8],
        previousEmpty : true,
        nextEmpty : true,
    },  
    methods:{
        toggle()
        {
            this.closed = !this.closed;
        },
        chooseShapeTool(t){
            //清空
            clearChooseButton();
            canvas.currentDrawFunc = t;
            let sh = document.getElementById(t);
            sh.style.backgroundColor = buttonSelectedColor;
            sh.style.borderColor = buttonBorderSelectedColor;

            canvas.useShape();

            previousChooseButton.push(sh);
        },
        changeWidth()
        {
            let sel = document.getElementById("lineWidth");
            let w = sel.options[sel.selectedIndex].value;
            canvas.lineWidth = w;
            canvas.setDrawingSytle();
            console.log("canvas.lineWidth=",w);
        },
        chooseStraw()
        {            
            //清空
            clearChooseButton();     
            canvas.currentDrawFunc = 'Straw';
            let st = document.getElementById("straw");
            st.style.backgroundColor = buttonSelectedColor;
            st.style.borderColor = buttonBorderSelectedColor;
       
            canvas.useStraw();

            previousChooseButton.push(st);
        },
        changeColor1()
        {
            console.log("change color1");
            let c = document.getElementById('color1');
            canvas.color1 = c.value;
            canvas.setDrawingSytle();
        },
    }
})

//油漆桶工具
class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
//油漆桶工具的变量
var leftX, rightX, topY, bottomY, leftData, rightData, topData, bottomData;

//画布区域
var canvas = new Vue({
    el:'#drawing-area',
    data:{
        //画布的上下文
        ctx : {},
        previewCtx : {},
        //画布的大小和位置
        canvasX : 0,
        canvasY : 0,
        canvasWidth : 0,
        canvasHeight : 0,
        //颜色和笔画
        color1 : "black",
        color2 : "#FFFFFF",
        lineWidth : 1,
        //是否在绘画中
        drawing : false,
        //位置序列
        mousePos : [],
        //画布状态队列
        previousImg : [],
        currentImg : "",
        afterImg : [],
        //当前使用的操作
        currentDrawFunc : "",
        //当前插入的文本
        insertText : "" ,
    },
    mounted: function(){
        //计算canvas的位置
        let mc = document.getElementById("mainCanvas");
        this.canvasX = mc.offsetLeft;
        this.canvasY = mc.offsetTop;
        this.canvasWidth = mc.width;
        this.canvasHeight = mc.height;
        //设置上下文
        this.ctx = document.getElementById("mainCanvas").getContext("2d");
        this.previewCtx = document.getElementById("previewCanvas").getContext("2d");
        //初始化画布
        this.initMainCanvas();    
        console.log("canvas created");
        
        //保存当前的mainCanvas
        this.saveCurrentMainCanvas('previous');
    },
    methods:{
        ////由谢运帷创建
        //清除整个画布
        clearCanvas(){
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight);
            console.log ("init");
        },
        //吸管
        straw(e)
        {
            //计算鼠标位置
            let mouseX = e.pageX - this.canvasX;
            let mouseY = e.pageY - this.canvasY;

            //提取颜色
            let color = this.ctx.getImageData(mouseX,mouseY,1,1);
            color = "#" + (color.data[0] >= 16 ? color.data[0].toString(16) : "0" + color.data[0].toString(16) ) 
                        + (color.data[1] >= 16 ? color.data[1].toString(16) : "0" + color.data[1].toString(16) )
                        + (color.data[2] >= 16 ? color.data[2].toString(16) : "0" + color.data[2].toString(16) );
            this.ctx.fillStyle = color;
            console.log(color);

            //设置为颜色1
            document.getElementById("color1").value = color;
            this.color1 = color;
            this.setDrawingSytle();

            //把按钮颜色恢复
            document.getElementById("straw").style.backgroundColor = buttonAutoColor;
            document.getElementById("straw").style.borderColor = buttonBorderAutoColor;

            //清空当前选择的操作
            this.currentDrawFunc = "";

            this.clearCanvasMouseEvent();
        },
        //开始鼠标路径
        beginPath(e)
        {
            this.ctx.save();
            console.log("begin drawing");
            //计算鼠标位置
            let mouseX = e.pageX - this.canvasX;
            let mouseY = e.pageY - this.canvasY;
  
            //开始绘图        
            this.ctx.beginPath();
            this.ctx.moveTo(mouseX,mouseY);

            //配置绘画
            this.setDrawingSytle();

            this.drawing = true;
            //当前位置插入队列
            this.mousePos.push([mouseX,mouseY]);
        },
        //结束鼠标路径
        endPath(e)
        {
            console.log("end drawing");
            this.ctx.closePath();
            this.drawing = false;

            this.ctx.restore();

            //把预览画布上的内容复制到主画布上
            this.copyToMainCanvas();
            //清空位置队列
            this.mousePos.length = 0;

            if (this.currentDrawFunc)
            {
                //清空下一步队列
                this.clearAfterCanvas();
                //保存当前的主画布
                this.saveCurrentMainCanvas('save');
            }
        },
        //使用直线
        useShape()
        {
            this.clearCanvasMouseEvent();
            this.$el.onmousedown = this.beginPath;
            this.$el.onmouseup = this.endPath;
            this.$el.onmouseout = this.endPath;
            switch(this.currentDrawFunc)
            {
                case "Line":
                {
                    this.$el.onmousemove = this.drawLine;

                    break;
                }
                case "Rect":
                {
                    this.$el.onmousemove = this.drawRect;
                    break;
                }
                case "Ellipse":
                {
                    this.$el.onmousemove = this.drawEllipse;
                    break;
                }
                case "Triangle":
                {
                    this.$el.onmousemove = this.drawTriangle;
                    break;
                }
            }
        },
        //使用吸管
        useStraw()
        {
            this.clearCanvasMouseEvent();
            this.$el.onmousedown = "";
            this.$el.onmousemove = "";
            this.$el.onmouseup = this.straw;
        },
        //直线
        drawLine(e)
        {
            if (this.drawing === true)
            {
                //计算鼠标位置
                let mouseX = e.pageX - this.canvasX;
                let mouseY = e.pageY - this.canvasY;
                                
                //上一条直线的位置
                let preMouseX = this.mousePos[this.mousePos.length-1][0];
                let preMouseY = this.mousePos[this.mousePos.length-1][1];

                //这次直线的位置
                let firstMouseX = this.mousePos[0][0];
                let firstMouseY = this.mousePos[0][1];

                this.previewCtx.clearRect(preMouseX - firstMouseX > 0 ? firstMouseX - 5 : firstMouseX + 5,
                                          preMouseY - firstMouseY > 0 ? firstMouseY - 5 : firstMouseY + 5, 
                                          preMouseX - firstMouseX > 0 ? preMouseX - firstMouseX + 10 : preMouseX - firstMouseX - 10,
                                          preMouseY - firstMouseY > 0 ? preMouseY - firstMouseY + 10 : preMouseY - firstMouseY - 10);
                //绘制直线
                this.previewCtx.beginPath();
                this.previewCtx.moveTo(firstMouseX,firstMouseY);
                this.previewCtx.lineTo(mouseX,mouseY);
                this.previewCtx.stroke();  
                this.previewCtx.closePath();

                //这次的位置进入位置队列
                this.mousePos.push([mouseX,mouseY]);
            }
        },
        //矩形
        drawRect(e)
        {
            if(this.drawing === true)
            {
                //计算鼠标位置
                let mouseX = e.pageX - this.canvasX;
                let mouseY = e.pageY - this.canvasY;

                //上一个矩形的位置
                let preMouseX = this.mousePos[this.mousePos.length-1][0];
                let preMouseY = this.mousePos[this.mousePos.length-1][1];

                //这次矩形的位置
                let firstMouseX = this.mousePos[0][0];
                let firstMouseY = this.mousePos[0][1];

                this.previewCtx.clearRect(preMouseX - firstMouseX > 0 ? firstMouseX - 5 : firstMouseX + 5,
                                          preMouseY - firstMouseY > 0 ? firstMouseY - 5 : firstMouseY + 5, 
                                          preMouseX - firstMouseX > 0 ? preMouseX - firstMouseX + 10 : preMouseX - firstMouseX - 10,
                                          preMouseY - firstMouseY > 0 ? preMouseY - firstMouseY + 10 : preMouseY - firstMouseY - 10);

                this.previewCtx.beginPath();
                let width = mouseX - firstMouseX;
                let height = mouseY - firstMouseY;
                if (e.shiftKey == 1)
                {
                    if (Math.abs(width) > Math.abs(height))
                        width = Math.abs(width)/width * Math.abs(height);
                    else
                        height = Math.abs(height)/height * Math.abs(width);
                }
                this.previewCtx.rect(firstMouseX,firstMouseY,width,height);
                this.previewCtx.stroke();
                this.previewCtx.closePath();

                //这次的位置进入位置队列
                this.mousePos.push([mouseX,mouseY]);
            }
        },
        //椭圆&圆
        drawEllipse(e)
        {
            if (this.drawing === true)
            {
                //计算鼠标位置
                let mouseX = e.pageX - this.canvasX;
                let mouseY = e.pageY - this.canvasY;

                

                //上一个椭圆的位置
                let preMouseX = this.mousePos[this.mousePos.length-1][0];
                let preMouseY = this.mousePos[this.mousePos.length-1][1];

                //这次椭圆的位置
                let firstMouseX = this.mousePos[0][0];
                let firstMouseY = this.mousePos[0][1];

                this.previewCtx.clearRect(preMouseX - firstMouseX > 0 ? firstMouseX - 5 : firstMouseX + 5,
                                          preMouseY - firstMouseY > 0 ? firstMouseY - 5 : firstMouseY + 5, 
                                          preMouseX - firstMouseX > 0 ? preMouseX - firstMouseX + 10 : preMouseX - firstMouseX - 10,
                                          preMouseY - firstMouseY > 0 ? preMouseY - firstMouseY + 10 : preMouseY - firstMouseY - 10);

                this.previewCtx.beginPath();
                let centerX = (mouseX + firstMouseX) / 2;
                let centerY = (mouseY + firstMouseY) / 2;
                let a = mouseX > firstMouseX ? centerX - firstMouseX : centerX - mouseX;
                let b = mouseY > firstMouseY ? centerY - firstMouseY : centerY - mouseY; 
                if (e.shiftKey == 1)
                {
                    if (a > b)
                    {
                        a = b;
                        centerX = mouseX > firstMouseX ? firstMouseX + a : firstMouseX - a;
                    }
                    else
                    {
                        b = a;
                        centerY = mouseY > firstMouseY ? firstMouseY + b : firstMouseY - a;
                    }
                    console.log('shiftKey!');
                }
                //console.log(a,b);
                this.previewCtx.ellipse(centerX,centerY,a,b);
                
                
                //this.previewCtx.arc(firstMouseX,firstMouseY,mouseX - firstMouseX,mouseY - firstMouseY);
                this.previewCtx.stroke();
                this.previewCtx.closePath();

                //这次的位置进入位置队列
                this.mousePos.push([mouseX,mouseY]);
            }
        },
        //三角形
        drawTriangle(e)
        {
            if (this.drawing === true)
            {
                //计算鼠标位置
                let mouseX = e.pageX - this.canvasX;
                let mouseY = e.pageY - this.canvasY;

                //上一个三角形的位置
                let preMouseX = this.mousePos[this.mousePos.length-1][0];
                let preMouseY = this.mousePos[this.mousePos.length-1][1];

                //这次三角形的位置
                let firstMouseX = this.mousePos[0][0];
                let firstMouseY = this.mousePos[0][1];

                this.previewCtx.clearRect(preMouseX - firstMouseX > 0 ? firstMouseX - 5 : firstMouseX + 5,
                                          preMouseY - firstMouseY > 0 ? firstMouseY - 5 : firstMouseY + 5, 
                                          preMouseX - firstMouseX > 0 ? preMouseX - firstMouseX + 10 : preMouseX - firstMouseX - 10,
                                          preMouseY - firstMouseY > 0 ? preMouseY - firstMouseY + 10 : preMouseY - firstMouseY - 10);
                
                let TriX = mouseX;
                let TriY = mouseY;
                if (e.shiftKey == 1)
                {
                    if (Math.abs(TriX - firstMouseX) > Math.abs((TriY - firstMouseY) / Math.sqrt(3) * 2))
                    {
                        TriX = mouseX > firstMouseX ? firstMouseX + Math.abs((TriY - firstMouseY) / Math.sqrt(3) * 2) : firstMouseX - Math.abs((TriY - firstMouseY) / Math.sqrt(3) * 2);
                    }
                    else
                    {
                        TriY = mouseY > firstMouseY ? firstMouseY + Math.abs((TriX - firstMouseX) / 2 * Math.sqrt(3)) : firstMouseY - Math.abs((TriX - firstMouseX) / 2 * Math.sqrt(3));
                    }
                }
                this.previewCtx.beginPath();
                let centerX = (TriX + firstMouseX) / 2;
                this.previewCtx.moveTo(centerX,firstMouseY);
                this.previewCtx.lineTo(TriX,TriY);
                this.previewCtx.lineTo(firstMouseX,TriY);
                this.previewCtx.lineTo(centerX,firstMouseY);
                this.previewCtx.stroke();
                this.previewCtx.closePath();

                //这次的位置进入位置队列
                this.mousePos.push([mouseX,mouseY]);
            }
        },
        //把预览画布上的内容复制到主画布上
        copyToMainCanvas()
        {
            let img = this.ctx.getImageData(0,0,this.canvasWidth,this.canvasHeight);
            let previewImg = this.previewCtx.getImageData(0,0,this.canvasWidth,this.canvasHeight);
            for (let i=0;i<previewImg.data.length;i+=4)
            {
                if (previewImg.data[i+3]!=0)
                {
                    img.data[i]=  previewImg.data[i];
                    img.data[i+1]= previewImg.data[i+1];
                    img.data[i+2]= previewImg.data[i+2];
                    img.data[i+3]= 255;
                }
            }
            this.ctx.putImageData(img,0,0);
            //清空预览画布内容
            this.previewCtx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
        },
        //旋转90度
        rotate90(input)
        {
            let mainCanvas = document.getElementById("mainCanvas");
            let previewCanvas = document.getElementById("previewCanvas");

            let img = document.getElementById("mainCanvas");
            console.log(img);
            //改变预览画布的大小
            previewCanvas.height = this.canvasWidth;
            previewCanvas.width = this.canvasHeight;
            console.log(previewCanvas.width,previewCanvas.height);

            this.previewCtx.save();
            this.previewCtx.translate(previewCanvas.width/2,previewCanvas.height/2);
            if (input === 0)//顺时针
                this.previewCtx.rotate(Math.PI / 2);
            else 
                this.previewCtx.rotate(-Math.PI / 2);
            this.previewCtx.drawImage(img,-previewCanvas.height/2,-previewCanvas.width/2);
            this.previewCtx.restore();

            //改变&清空主画布
            mainCanvas.height = this.canvasWidth;
            mainCanvas.width = this.canvasHeight;
            this.canvasWidth = mainCanvas.width;
            this.canvasHeight = mainCanvas.height;
            //复制到主画布上
            this.copyToMainCanvas();

            //保存current画布
            this.saveCurrentMainCanvas('save');
            //清空下一步队列
            this.clearAfterCanvas();

            //如果长宽不相等 重新设置div的大小
            if (this.canvasWidth!=this.canvasHeight)
                canvasResize();
        },
        //进行绘画配置
        setDrawingSytle()
        {
            //主画布 
            this.ctx.strokeStyle = this.color1;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.fillStyle = this.color1;
            //预览画布
            this.globalAlpha = 0.5;
            this.previewCtx.strokeStyle = this.color1;
            this.previewCtx.lineWidth = this.lineWidth;
        },
        //设置笔画的粗细
        setPenWidth(m)
        {
            this.lineWidth = m;
        },
        //清空之后的画布
        clearAfterCanvas()
        {
            this.afterImg.length = 0;
        },
        //清空之前的画布
        clearPreviousCanvas()
        {
            this.previousImg.length = 0;
        },
        //保存当前主画布
        saveCurrentMainCanvas(direction)
        {
            let cd = this.ctx.getImageData(0,0,this.canvasWidth,this.canvasHeight);
            if (direction == 'save')
            {
                //判断两个画布是不是相同
                let flag = true;
                if (cd.width != this.currentImg.width || cd.height != this.currentImg.height)
                    flag = false;
                console.log(flag);
                if (flag === true)
                {
                    for (let i=0;i<cd.data.length;i++)
                    {
                        if (cd.data[i]!=this.currentImg.data[i])
                        {
                            flag = false;
                            break;
                        }
                    }
                }
                console.log(flag);
                if (flag === true)
                    return;
                this.previousImg.push(this.currentImg)
            }
            else if (direction == 'previous')
            {
                //把Current的画布推入previous中
                if (this.currentImg)
                    this.previousImg.push(this.currentImg);
            }
            else if (direction == 'next')
            {
                if (this.currentImg)
                    this.afterImg.push(this.currentImg);
            }
            this.currentImg = cd;
            
            //判断之前之后是否为空
            if (this.previousImg.length === 0)
                leftToolBar.previousEmpty = true;
            else
                leftToolBar.previousEmpty = false;

            if (this.afterImg.length === 0)
                leftToolBar.nextEmpty = true;
            else
                leftToolBar.nextEmpty = false;
        },
        //画布回退、清空、下一步操作
        controlCanvas(action)
        {
            switch(action)
            {
                case 'previous':
                {
                    if (this.previousImg.length == 0)
                    {
                        console.log('No previous canvas!');
                        break ;
                    }
                    //保存当前的主画布
                    this.saveCurrentMainCanvas('next');
                    //把之前的最后一个取出来
                    this.currentImg = this.previousImg.pop();
                    //console.log(this.currentImg.width,this.currentImg.height);
                    //清空&重绘当前画布
                    let mainCanvas = document.getElementById("mainCanvas");
                    let previewCanvas = document.getElementById("previewCanvas");

                    mainCanvas.height = this.currentImg.height;
                    mainCanvas.width = this.currentImg.width;
                    previewCanvas.height = this.currentImg.height;
                    previewCanvas.width = this.currentImg.width;

                    this.canvasHeight = this.currentImg.height;
                    this.canvasWidth = this.currentImg.width;

                    this.ctx.putImageData(this.currentImg,0,0);

                    this.setDrawingSytle();
                    canvasResize();
                    break;
                }
                case 'next':
                {
                    if (this.afterImg.length == 0)
                    {
                        console.log('No after canvas!');
                        break ;
                    }
                    //保存当前的主画布
                    this.saveCurrentMainCanvas('previous');
                    //把之前的最后一个取出来
                    this.currentImg = this.afterImg.pop();
                    //清空&重绘当前画布
                    let mainCanvas = document.getElementById("mainCanvas");
                    let previewCanvas = document.getElementById("previewCanvas");
                    mainCanvas.height = this.currentImg.height;
                    mainCanvas.width = this.currentImg.width;
                    previewCanvas.height = this.currentImg.height;
                    previewCanvas.width = this.currentImg.width;
                    
                    this.canvasHeight = this.currentImg.height;
                    this.canvasWidth = this.currentImg.width;

                    this.ctx.putImageData(this.currentImg,0,0);

                    this.setDrawingSytle();
                    canvasResize();
                    break;
                }
                case 'clear':
                {
                    //清空画布
                    let mainCanvas = document.getElementById("mainCanvas");
                    let previewCanvas = document.getElementById("previewCanvas");
                    mainCanvas.height = mainCanvas.height;
                    mainCanvas.width = mainCanvas.width;
                    previewCanvas.height = mainCanvas.height;
                    previewCanvas.width = mainCanvas.width;

                    //清空画布状态队列
                    this.clearAfterCanvas();
                    this.clearPreviousCanvas();
                    this.currentImg = "";
                    this.saveCurrentMainCanvas('previous');
                    this.setDrawingSytle();
                }
            }
            if (this.previousImg.length === 0)
                leftToolBar.previousEmpty = true;
            else
                leftToolBar.previousEmpty = false;

            if (this.afterImg.length === 0)
                leftToolBar.nextEmpty = true;
            else
                leftToolBar.nextEmpty = false;
        },
        //清空当前的画布的事件
        clearCanvasMouseEvent()
        {
            this.$el.onmousedown = null;
            this.$el.onmousemove = null;
            this.$el.onmouseup = null;
            this.$el.onmouseout = null;
        },
        //初始化整个画布
        initMainCanvas()
        {
            this.ctx.save();
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight);
            this.ctx.restore();
        },


        ////由田宇创建
        open(){
            var imgfile = document.getElementById("open").files[0];
            if (!/image\/\w+/.test(imgfile.type)) {
                alert("只能处理图片");
                return false;
            }

            var reader = new FileReader();
            var tmp = new Image;

            //处理图片
            reader.onload = function () {
                tmp.src = reader.result;
            }
            reader.readAsDataURL(imgfile);

            tmp.onload = function () {
                //canvas.ctx.clearRect(0,0,canvas.canvasWidth,canvas.canvasHeight);
                canvas.ctx.drawImage(tmp, 0, 0);
            }
        },
        bucket(){
            this.clearCanvasMouseEvent();
            let buc = document.getElementById("bucket");
            buc.style.backgroundColor = buttonSelectedColor;
            buc.style.borderColor = buttonBorderSelectedColor;
            //let canvas = document.getElementById("mainCanvas");
            this.$el.onmousedown = function () {
                canvas.ctx.fillRect(0, 0, canvas.canvasWidth, canvas.canvasHeight);
                
                //清空下一步队列
                canvas.clearAfterCanvas();
                canvas.saveCurrentMainCanvas('save');
            }
        },
        text(){
            canvas.insertText = prompt("输入要插入的文本","");
            this.clearCanvasMouseEvent();
            canvas.ctx.font = "26px Arial";
            let tex = document.getElementById("text");
            tex.style.backgroundColor = buttonSelectedColor;
            tex.style.borderColor = buttonBorderSelectedColor;
            this.$el.onmousedown = function (ev) {
                canvas.ctx.fillText(canvas.insertText, ev.pageX - canvas.canvasX, ev.pageY - canvas.canvasY);
                //清空下一步队列
                canvas.clearAfterCanvas();
                canvas.saveCurrentMainCanvas('save');
            }
        },
        changeSize(){
            let c = document.getElementById("mainCanvas");
            var data = canvas.ctx.getImageData(0, 0, canvas.canvasWidth, canvas.canvasWidth);
            c.width *= 1.1;
            c.height *= 1.1;
            canvas.ctx.putImageData(data, 0, 0);
            //记录新的宽和高
            canvas.canvasWidth = c.width;
            canvas.canvasHeight = c.height;

            let pc = document.getElementById("previewCanvas");
            pc.height = c.height;
            pc.width = c.width;

            canvas.saveCurrentMainCanvas('save');
            //清空下一步队列
            canvas.clearAfterCanvas();
        },
        //需要手动设置文件名为 *.png
        save(){
            fname = prompt("要保存的文件名(.png)","");
            let canvas = document.getElementById("mainCanvas");
            var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            //window.location.href = image;
            // 下载后的问题名
            var filename = fname + '.' + 'png';
            // download
            saveFile(image,filename);
        },
        clear(){
            canvas.ctx.clearRect(0, 0, canvas.canvasWidth, canvas.canvasHeight);
        },
        pencil() {
            this.clearCanvasMouseEvent();
            let pen = document.getElementById("pencil");
            pen.style.backgroundColor = buttonSelectedColor;
            pen.style.borderColor = buttonBorderSelectedColor;
            //let canvas = document.getElementById("mainCanvas");
            var flag = 0; // 鼠标是否按下
            this.$el.onmousedown = function (e) {
                var startX = e.pageX - canvas.canvasX;
                var startY = e.pageY - canvas.canvasY;

                canvas.ctx.beginPath();
                canvas.ctx.moveTo(startX, startY);
                flag = 1;
            },

            this.$el.onmousemove = function (e) {
                var endX = e.pageX - canvas.canvasX;
                var endY = e.pageY - canvas.canvasY;

                if (flag) {
                    canvas.ctx.lineTo(endX, endY);
                    canvas.ctx.stroke();
                }
            }

            this.$el.onmouseup = function () {
                flag = 0;
                
                //清空下一步队列
                canvas.clearAfterCanvas();
                canvas.saveCurrentMainCanvas('save');
            }

            this.$el.onmouseout = function () {
                flag = 0;
                
                //清空下一步队列
                canvas.clearAfterCanvas();
                canvas.saveCurrentMainCanvas('save');
            }
        },
        //该方法不适用透明背景
        eraser0() {
            this.clearCanvasMouseEvent();
            let era = document.getElementById("eraser");
            era.style.backgroundColor = buttonSelectedColor;
            era.style.borderColor = buttonBorderSelectedColor;
            //let canvas = document.getElementById("mainCanvas");
            var flag = 0;
            this.$el.onmousedown = function (e) {
                canvas.ctx.save();
                canvas.ctx.strokeStyle = "white";
                canvas.ctx.lineWidth = 15;
                var startX = e.pageX - canvas.canvasX;
                var startY = e.pageY - canvas.canvasY;

                canvas.ctx.beginPath();
                canvas.ctx.moveTo(startX, startY);
                flag = 1;
            }

            this.$el.onmousemove = function (e) {
                var endX = e.pageX - canvas.canvasX;
                var endY = e.pageY - canvas.canvasY;

                if (flag) {
                    canvas.ctx.lineTo(endX, endY);
                    canvas.ctx.stroke();
                }
            }

            this.$el.onmouseup = function () {
                canvas.ctx.strokeStyle = canvas.color1;
                canvas.ctx.lineWidth = canvas.lineWidth;
                flag = 0;
                
                //清空下一步队列
                canvas.clearAfterCanvas();
                canvas.saveCurrentMainCanvas('save');
                canvas.ctx.restore();
            }

            this.$el.onmouseout = function () {
                canvas.ctx.strokeStyle = canvas.color1;
                canvas.ctx.lineWidth = canvas.lineWidth;
                flag = 0;
                
                //清空下一步队列
                canvas.clearAfterCanvas();
                canvas.saveCurrentMainCanvas('save');
                canvas.ctx.restore();
            }
        },
        eraser() {
            this.clearCanvasMouseEvent();

            let era = document.getElementById("eraser");
            era.style.backgroundColor = buttonSelectedColor;
            era.style.borderColor = buttonBorderSelectedColor;
            //let canvas = document.getElementById("mainCanvas");
            var flag = 0;
            this.$el.onmousedown = function (e) {
                canvas.ctx.save();
                canvas.ctx.lineWidth = 5;
                var eraserX = e.pageX - canvas.canvasX;
                var eraserY = e.pageY - canvas.canvasY;
                canvas.ctx.clearRect(eraserX - canvas.ctx.lineWidth, eraserY - canvas.ctx.lineWidth, canvas.ctx.lineWidth * 2, canvas.ctx.lineWidth * 2);
                flag = 1;
            }

            this.$el.onmousemove = function (e) {
                var eraserX = e.pageX - canvas.canvasX;
                var eraserY = e.pageY - canvas.canvasY;

                if (flag) {
                    canvas.ctx.clearRect(eraserX - canvas.ctx.lineWidth, eraserY - canvas.ctx.lineWidth, canvas.ctx.lineWidth * 3, canvas.ctx.lineWidth * 3);
                }

            }

            this.$el.onmouseup = function (e) {
                canvas.ctx.lineWidth = canvas.lineWidth;
                flag = 0;
                
                //清空下一步队列
                canvas.clearAfterCanvas();
                canvas.saveCurrentMainCanvas('save');
                canvas.ctx.restore();
            }

            this.$el.onmouseout = function (e) {
                canvas.ctx.lineWidth = canvas.lineWidth;
                flag = 0;
                
                //清空下一步队列
                canvas.clearAfterCanvas();
                canvas.saveCurrentMainCanvas('save');
                canvas.ctx.restore();
            }
        },
        fill() {
            this.clearCanvasMouseEvent();

            let buc = document.getElementById("bucket");
            buc.style.backgroundColor = buttonSelectedColor;
            buc.style.borderColor = buttonBorderSelectedColor;

            this.$el.onmousedown = function (e) {

                var startX = e.pageX - canvas.canvasX;
                var startY = e.pageY - canvas.canvasY;
                console.log(startX,startY);
                canvas.fillData(startX, startY);

                
                //清空下一步队列
                canvas.clearAfterCanvas();
                canvas.saveCurrentMainCanvas('save');
            }
        },
        fillData(startX, startY) {
            //选中的位置的颜色
            var tmp = this.ctx.getImageData(startX, startY , 1, 1).data.slice(0, 4).toString();
            console.log(tmp);
            //四个方向的颜色
            topData = this.ctx.getImageData(startX, startY - 1, 1, 1).data.slice(0, 4).toString();
            bottomData = this.ctx.getImageData(startX, startY + 1, 1, 1).data.slice(0, 4).toString();
            leftData = this.ctx.getImageData(startX - 1, startY, 1, 1).data.slice(0, 4).toString();
            rightData = this.ctx.getImageData(startX + 1, startY, 1, 1).data.slice(0, 4).toString();

            var s = new Array; //基准点集合
            s.push(new point(startX, startY));
            this.fillline(s[0],tmp);

            var p = new point;
            var sX;

            //通过基准点，基于扫描线的泛洪填充
            while (s.length > 0) {
                //初始化
                sX = s[s.length - 1].x;
                topY = s.pop().y;
                bottomY = topY;
                p = (0, 0);
                topData = this.ctx.getImageData(sX, topY - 1, 1, 1).data.slice(0, 4).toString();
                bottomData = this.ctx.getImageData(sX, bottomY + 1, 1, 1).data.slice(0, 4).toString();

                let upUpBorder = {};
                let upDownBorder = [];
                //向上扫描
                while (topData === tmp && topY > 0) {
                    topY--;
                    topData = this.ctx.getImageData(sX, topY - 1, 1, 1).data.slice(0, 4).toString();
                    p = this.fillline(new point(sX, topY),tmp);

                    for (var i = p.x; i < p.y; i++) {
                        upUpBorder[i] = topY;
                        if (this.ctx.getImageData(i,topY - 1, 1, 1).data.slice(0,4).toString() === tmp){
                            upDownBorder.push(new point(i,topY));
                        }
                    }
                }
                //添加新的基准点
                for (let x in upUpBorder)
                {
                    s.push(new point(x,upUpBorder[x]));
                }
                for (let x=0;x<upDownBorder.length;x++)
                {
                    s.push(upDownBorder[x]);
                }
                // //添加新的基准点
                // for (var i = p.x; i < p.y; i++) {
                //     s.push(new point(i, topY));
                // }

                let downUpBorder = [];
                let downDownBorder = {};
                //向下扫描
                while (bottomData === tmp && bottomY < canvas.canvasHeight) {
                    bottomY++;
                    bottomData = this.ctx.getImageData(sX, bottomY + 1, 1, 1).data.slice(0, 4).toString();
                    p = this.fillline(new point(sX, bottomY),tmp);

                    for (var i=p.x;i<p.y;i++){
                        downDownBorder[i] = bottomY;
                        if (this.ctx.getImageData(i,bottomY + 1, 1, 1).data.slice(0,4).toString() === tmp){
                            downUpBorder.push(new point(i,bottomY));
                        }
                    }
                }

                //添加新的基准点
                for (let x in downDownBorder)
                {
                    s.push(new point(x,downDownBorder[x]));
                }
                for (let x=0;x<downUpBorder.length;x++)
                {
                    s.push(downUpBorder[x]);
                }
                // //添加新的基准点
                // for (var i = p.x; i < p.y; i++) {
                //     s.push(new point(i, bottomY));
                // }

                //清空
                upUpBorder = {};
                upDownBorder = [];
                downUpBorder = [];
                downDownBorder = {};
            }
        },
        //传入基准点，填充扫描线
        fillline(p,tmp) {

            leftX = p.x;
            rightX = p.x;

            while (leftData === tmp && leftX > 0) {
                leftX--;
                leftData = this.ctx.getImageData(leftX - 1, p.y, 1, 1).data.slice(0, 4).toString();
            }
            while (rightData === tmp && rightX < canvas.canvasWidth) {
                rightX++;
                rightData = this.ctx.getImageData(rightX + 1, p.y, 1, 1).data.slice(0, 4).toString();
            }

            this.ctx.fillRect(leftX, p.y, rightX - leftX + 1, 1);
            // leftData = "0,0,0,0";
            // rightData = "0,0,0,0";
            leftData = tmp;
            rightData = tmp;
            return new point(leftX, rightX);
        }
    }
});










