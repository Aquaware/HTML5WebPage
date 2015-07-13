var canvas;
var stage;
var star;
var shouldUpdate = true;
var container;
var imageObject;
var handles= [];
var RADIANS_TO_DEGREES = 180 / Math.PI;

function init() {
    canvas = document.getElementById("myCanvas");
    stage = new Stage(canvas);
    Touch.enable(stage);
    // enabled mouse over / out events
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas
    container = new Container();
    stage.addChild(container);
    
    
    beginLoadBitmap();
    //beginAnimation();
}

function updateCanvas() {
    stage.update();
}

function beginAnimation() {
    var data = {
            framerate: 10,
            images: ["images/penguine_sheet.png"],
            frames: {width: 67, height: 75, count: 6, regX: 35, regY: 75},
        animations: {
                    walk: {frames: [0, 1,2,3,4,5]}
        }
    };
    
    var spriteSheet = new createjs.SpriteSheet(data);
    var sprite = new createjs.Sprite(spriteSheet, "walk");
    sprite.x = stage.canvas.width / 2;
    sprite.y =100;

    // Add Grant to the stage, and add it as a listener to Ticker to get updates each frame.
    stage.addChild(sprite);
    Ticker.timingMode = createjs.Ticker.RAF;
    Ticker.addEventListener("tick", stage);
}  

function beginLoadBitmap() {
    var image = new Image();
    image.src = "./images/Pen.png";
    image.onload = bitmapLoaded;
}

function bitmapLoaded(event) {
    var imageURI = event.target;

    imageObject = new Bitmap(imageURI);
    var hitObject = new createjs.Shape();
    hitObject.graphics.beginFill("#000000").drawRect(0, 0, imageObject.image.width, imageObject.image.height);
    imageObject.hitArea = hitObject;
    stage.addChild(imageObject);
    imageObject.x = 300;
    imageObject.y = 200;
    imageObject.regX = 0;
    imageObject.regY = 0;
    updateCanvas();
    
    imageObject.on("mousedown", function (event) {
        var clickPoint = new Point(event.stageX, event.stageY);
        var localPoint = this.globalToLocal(clickPoint.x, clickPoint.y);
        this.globalClickPoint = clickPoint;
        this.localClickPoint = localPoint;
        this.initialPoint = new Point(this.x, this.y);
        createHandles(this);
        stage.update();
    });

    /*
    imageObject.on("pressmove", function (event) {
        this.x = event.stageX;
        this.y = event.stageY;    
        stage.update(); 
        var offsetX = event.stageX - this.clickPoint.x;
        var offsetY = event.stageY - this.clickPoint.y;
        stage.update();
    });
*/
    //Ticker.addEventListener("tick", timerUpdate);
}

function createHandles(imageObject) {
    if(handles.length == 0) {
        for(var i = 0; i < 3; i++ ) {
            if( i == 1 ) {
                handles[i] = createDraggableCircle(0, 0, true);
            }
            else {
                handles[i] = createDraggableCircle(0, 0, false);
            }
            handles[i].tag = i;
        }
    }
    updateHandles(imageObject);
    
    stage.update();
}

function updateHandles(imageObject) {
    var leftTop = leftTopPoint(imageObject);
    handles[0].x = leftTop.x;
    handles[0].y = leftTop.y;
    handles[1].x = leftTop.x + imageObject.image.width;
    handles[1].y = leftTop.y;
    handles[2].x = leftTop.x;
    handles[2].y = leftTop.y + imageObject.image.height;       
}

function leftTopPoint(imageObject) {
    if(imageObject) {
        return new Point(imageObject.x - imageObject.regX, imageObject.y - imageObject.regY);
    }
    else {
        return new Point(-1, -1);
    }
}

function createDraggableCircle(x, y, mouseEnable) {

    var circle = createCircle(x, y, 6);
    
    if(mouseEnable) {
        circle.on("mousedown", function (event) {
            this.offset = new Point(this.x - event.stageX, this.y - event.stageY);
        });
                  
        circle.on("pressmove", function (event) {
            this.x = event.stageX + this.offset.x;
            this.y = event.stageY + this.offset.y;
            
        
            var matrix = new Matrix2D();
            matrix.a = ( this.x - imageObject.x ) / imageObject.image.width;
            matrix.b = 0;
            matrix.c = 0;
            matrix.d = (imageObject.initialPoint.y + imageObject.image.height - this.y ) / imageObject.image.height;
            matrix.tx = imageObject.initialPoint.x;
            matrix.ty = this.y;
            matrix.decompose(imageObject);
           stage.update();    
        });
    }
        
    stage.addChild(circle);
    
    return circle;
}

function createCircle(x, y, radius) {
    var shape = new Shape();
    shape.x = x;
    shape.y = y;
    var color = Graphics.getRGB(0xff8888);
    shape.graphics.beginFill(color).drawCircle(x, y, radius);
    
    return shape;
}

function createStar() {
    star = new Shape(graphics);
    star.x = 50;
    star.y = 60;
    stage.addChild(star);
    setTween(star);
    Ticker.addEventListener("tick", timerUpdate);
    star.graphics.beginStroke("#0000ff").beginFill("#00ffff").drawPolyStar(0, 0, 40, 5, 0.6, -90)  
}

function createStar() {
    star = new Shape(graphics);
    star.x = 50;
    star.y = 60;
    stage.addChild(star);
    setTween(star);
    Ticker.addEventListener("tick", timerUpdate);
    star.graphics.beginStroke("#0000ff").beginFill("#00ffff").drawPolyStar(0, 0, 40, 5, 0.6, -90)  
}



function timerUpdate(event) {
    if(shouldUpdate) {
        updateCanvas();
    }
}

function setTween(target) {
    var tween = new Tween(target, {loop: true});
    tween.to({x: 600, y: 300 - 20, rotation: 360, alpha: 0.3}, 5000, Ease.bounceOut);
    tween.wait(500);
    tween.to({alpha: 0}, 3000, Ease.circIn);
}

