console.log("Phone Control!");
//全局变量，触摸开始位置
var fireLength = 10;
var fireLock = false;
var startX = 0, startY = 0;
            
            //touchstart事件
            function touchStartFunc(evt) {
                try
                {
                    //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等

                    var touch = evt.touches[0]; //获取第一个触点
                    var x = Number(touch.pageX); //页面触点X坐标
                    var y = Number(touch.pageY); //页面触点Y坐标
                    //记录触点初始位置
                    startX = x;
                    startY = y;

                    console.log('start!');

                }
                catch (e) {
                    alert('touchSatrtFunc：' + e.message);
                }
            }

            //touchmove事件，这个事件无法获取坐标
            function touchMoveFunc(evt) {
                try
                {
                    evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
                    var touch = evt.touches[0]; //获取第一个触点
                    var x = Number(touch.pageX); //页面触点X坐标
                    var y = Number(touch.pageY); //页面触点Y坐标

                    var text = 'TouchMove事件触发：（' + x + ', ' + y + '）';
                    
                    var div = document.getElementById("gameArea");

                    if (fireLock === true)
                        return;

                    //判断滑动方向
                    if (x - startX > fireLength) {
                        //右
                        fireKeyEvent(div,'keydown',39);
                        fireLock = true;
                    }
                    else if (startX - x > fireLength)
                    {
                        //左
                        fireKeyEvent(div,'keydown',37);
                        fireLock = true;
                    }

                    

                    if (y - startY > fireLength) {
                        //下
                        fireKeyEvent(div,'keydown',40);
                        fireLock = true;
                    }
                    else if (startY - y > fireLength)
                    {
                        //上
                        fireKeyEvent(div,'keydown',38);
                        fireLock = true;
                    }

                    console.log("move!");
                }
                catch (e) {
                    alert('touchMoveFunc：' + e.message);
                }
            }

            //touchend事件
            function touchEndFunc(evt) {
                try {
                    //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
                    fireLock = false;
                    console.log("end!");
                }
                catch (e) {
                    alert('touchEndFunc：' + e.message);
                }
            }

            //绑定事件
            function bindEvent() {
                document.addEventListener('touchstart', touchStartFunc, false);
                document.addEventListener('touchmove', touchMoveFunc, false);
                document.addEventListener('touchend', touchEndFunc, false);
            }

            //判断是否支持触摸事件
            function isTouchDevice() {
                //document.getElementById("gameArea").innerHTML = navigator.appVersion;

                try {
                    document.createEvent("TouchEvent");
                    console.log("Has TouchEvent");

                    bindEvent(); //绑定事件
                }
                catch (e) {
                    console.log("Doesn't has TouchEvent" + e.message);
                }
            }

//发出键盘事件
function fireKeyEvent(el, evtType, keyCode){
    var doc = el.ownerDocument,
        win = doc.defaultView || doc.parentWindow,
        evtObj;
    if(doc.createEvent){
        if(win.KeyEvent) {
            evtObj = doc.createEvent('KeyEvents');
            evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
        }
        else {
            evtObj = doc.createEvent('UIEvents');
            Object.defineProperty(evtObj, 'keyCode', {
            get : function() { return this.keyCodeVal; }
            });     
            Object.defineProperty(evtObj, 'which', {
                get : function() { return this.keyCodeVal; }
            });
            evtObj.initUIEvent( evtType, true, true, win, 1 );
            evtObj.keyCodeVal = keyCode;
            if (evtObj.keyCode !== keyCode) {
                console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
            }
        }
        el.dispatchEvent(evtObj);
    } 
    else if(doc.createEventObject){
        evtObj = doc.createEventObject();
        evtObj.keyCode = keyCode;
        el.fireEvent('on' + evtType, evtObj);
    }
}

