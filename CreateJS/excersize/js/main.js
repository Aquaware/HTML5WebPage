var canvas;
var stage;
var imageObject;
var RADIANS_TO_DEGREES = 180 / Math.PI;
var DEGREES_TO_RADIANS = Math.PI / 180;

var ballContainer;

function fileDrop() {
    var dropzone = $("#dropzone");
    
}

function enableDrop( event )
{
	// ドロップを受け付ける
	event.preventDefault();
}

function didFileDropped(event) {
    event.preventDefault();

    var dataTransfer = event.dataTransfer;
    // DataTransferオブジェクトからDataTransferItemListを参照
    if (dataTransfer && dataTransfer.items){
        var items = dataTransfer.items,
            len = items.length;
        // ドロップされたファイルが一つかチェック
        if (len === 1) {
            var item = items[0];
            var entry;
            // HTML5標準
            if (item.getAsEntry) {
                entry = item.getAsEntry();
            // Webkit実装
            } else if (item.webkitGetAsEntry) {
                entry = item.webkitGetAsEntry();
            }
            parseFile(entry, dataTransfer.files[0]);
        } else {
            var entries = new Array();
            for( i = 0; i < len; i++ ) {
                var item = items[i];
                var entry;
                // HTML5標準
                if (item.getAsEntry) {
                    entry = item.getAsEntry();
                    // Webkit実装
                } else if (item.webkitGetAsEntry) {
                    entry = item.webkitGetAsEntry();
                }
                entries[i] = entry;
            }
            parseFiles(entries, dataTransfer.files);
        }
    }
}


function parseFile(entry,file) { 
    if(entry.isFile) {     
        loadBitmapFromFile(file, addBitmap); 
    }
    else if(entry.isDirectory) {
        console.log( "folder: " + entry.fullPath );
        var reader = entry.createReader();
        // ディレクトリ内容の読み取り
        reader.readEntries(
            // 読み取り成功
            function(results) {
                // 再帰処理
                for (var i = 0, len = results.length; i < len; i++) {
                    traverseEntry(results[i]);
                }
            },
            // 読み取り失敗
            function(error) {
                    alert("読み込みに失敗しました。");
            }
        );
    }
}

function parseFiles(entries, files) {
    for(var i = 0; i < files.length; i++ ) {
        var entry = entries[i];
        var file = files[i];
        if(entry.isFile) {     
            loadBitmapFromFile(file, addBitmap); 
        }
    }
}
    
function addBitmap(bitmap) {
    stage.addChild(bitmap);
    stage.update();   
}

function init() {
    canvas = document.getElementById("myCanvas");
    stage = new Stage(canvas);
    Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;
    
    //beginLoadBitmap(imageObject, "./images/Pen.png", new Point(100, 150), new Point(0, 0));
    //exCircles();
    //exBarGraph();
    //exSlider();
    exButton();
}

function exButton() {
    
     var appearance = {borderColor:  {h: 180, s: 40, l: 70, a: 1.0},
                      fillColor:    {h: 180, s: 70, l: 70, a: 1.0}};
    var size = new CJSize(100, 40);
    var button = new CJButton(stage, 'button', 0, 0, appearance, size, 6);
    button.body.on("mousedown", function (event) {
        this.globalClickPoint = new Point(event.stageX, event.stageY);
        this.localClickPoint = this.globalToLocal(event.stageX, event.stageY);
        this.initialPosition = new Point(this.x, this.y);
        this.offset = new Point(this.x - event.stageX, this.y - event.stageY);
        this.parent.update();
    });
    
    button.body.on("pressmove", function (event) {
        this.x = event.stageX + this.offset.x;
        this.y = event.stageY + this.offset.y;
        this.parent.update();
    });
    button.setPosition(400, 50);
    
    var text = new Text("Hello World", "12px Arial", "#ffffff");
    size = new CJSize( text.getMeasuredWidth() + 40, text.getMeasuredLineHeight() + 10);
    var textButton = new CJTextButton(stage, 'button', 0, 0, text, appearance, size, 6);
    textButton.setPosition(300, 50);
    
    var text2 = new Text("Button", "12px Arial", "#ffffff");
    var appearance1 = {fillColor:   {h: 0, s: 80, l: 70, a: 1.0},
                      activeColor:  {h: 0, s: 80, l: 80, a: 1.0}};
    var roundButton = CJRoundTextButton(stage, 40, text2, appearance1);
    roundButton.x = 100;
    roundButton.y = 50;
    //var circle = new CJCircle(stage, "circle", 0, 1, appearance, 10);
    //stage.update();
    
    var image = new Image();
    image.onload = function() {
        var imageButton = CJImageButton(stage, this, new Point(300, 50),  6, appearance1);
    }
    image.src = "./images/1s.jpg";
    
    var table = new CJTable(stage, 6, 10, new CJSize(20, 20));
    table.setPosition(20, 250);
    stage.update();
}

function exSlider(){
    var button = createButton();
    button.x = 100;
    button.y = 200;
    stage.addChild(button);
    stage.update();
}

function createButton() {
    var width = 150;
    var height = 30;
    var text = "This is Button";
    var button = new Container();
    var padding = 3;
    
    var w = width - padding * 2;
    var h = height - padding * 2;
    
    var outside = new Shape();
    outside.graphics
     .beginFill("#2222ff")
     .drawRoundRect(padding, padding, w, h, 4);
    
    var blurFilter = new BlurFilter(0, 0, 2);
    blurFilter.blurX = blurFilter.blurY = 8; 
    outside.filters = [blurFilter];
    outside.cache(0, 0, width, height);
    button.addChild(outside);
    
    var inside = new Shape();
    inside.graphics
     .beginStroke("#ddddff")
     .beginFill("#cccccc")
     .drawRoundRect(padding, padding, w, h, 4);

    button.addChild(inside);
   
    return button;  
}

function drawSlider() {
    
    
}

function exBarGraph() {
    var data = [
                { city:"港区",   population: 5000.0 },
                { city:"横浜市", population: 1000.0 },
                { city:"大阪市", population: 4000.0 },
                { city:"札幌市", population: 3000.0 }
               ];
    
    drawGraph(data);
    stage.update();
}

function drawGraph(data) {
    var graph = new Container();
    graph.x = 100;
    graph.y = 100;
    stage.addChild(graph);
    
    var barWidthMax = 500;
    var barHeight = 50;
    var barSpace = 5;
    var textWidth = 60;
    
    for(var i = 0; i < 4; i++) {
        var text = createText(data[i].city);
        text.x = 5;
        text.y = i * (barHeight + barSpace) +  barHeight / 2;
        graph.addChild(text);

        var bar = createBar( new Point(textWidth, 0), i, data[i].population/ 10000, barWidthMax, barHeight, barSpace);
        graph.addChild(bar);

        var value = createText(data[i].population);
        value.textAlign = "left";
        value.x = textWidth + barWidthMax + 5;
        value.y = text.y;
        graph.addChild(value);
    }
}

function createText(text) {
    var text = new Text(text, "16px Sans-serif", "#333");
    text.textAlign = "right";
    text.textBaseline = "middle";

    return text;
}

function createBar(offset, index, value, barWidthMax, barHeight, barSpace) {
    var bar = new Shape();
    bar.graphics.beginLinearGradientFill(["#f00","#a00"], [0, 1], 0, 0, 0, barHeight);
    bar.graphics.drawRect(0, 0, value * barWidthMax, barHeight);
    bar.shadow = new Shadow("#88", 2, 2, 4);
    bar.x = offset.x;
    bar.y = offset.y + (barHeight + barSpace) * index;

    return bar;
}

function exCircles(){
 
    ballContainer = new Container();
    ballContainer.x = canvas.width / 2;
    ballContainer.y = canvas.height / 2;
    stage.addChild(ballContainer);
    for(var i = 0; i < 100; i++ ) {
        var ball = new Shape();
        var radius = 2 + Math.random() * 50;
        ball.graphics.beginFill(randomColor()).drawCircle(0, 0, radius);
        ball.x = 400 * Math.random() * Math.sin(i * 360 / 20 * DEGREES_TO_RADIANS);
        ball.y = 400 * Math.random() * Math.cos(i * 360 / 20 * DEGREES_TO_RADIANS);
        setBlur(ball, radius);
        ball.on("mousedown", function (event) {
            this.offset = new Point(this.x - event.stageX, this.y - event.stageY);
        });
                  
        ball.on("pressmove", function (event) {
            this.x = event.stageX + this.offset.x;
            this.y = event.stageY + this.offset.y;
            stage.update();    
        });
        
        ballContainer.addChild(ball);
        var r = 0.9 * Math.random();
        Tween.get(ball).to({alpha:0.5}).wait(100 * i).to({alpha:0.1}).wait(150 * i).to({alpha:1.0 * r});
    }
    stage.update();
    
    Ticker.timingMode = createjs.Ticker.RAF;
    Ticker.addEventListener("tick", ballsTick);
}

function ballsTick () {
    ballContainer.rotation += 1;
    stage.update();
}

function randomColor() {
    var code = Math.floor(Math.random() * 0xffffff);
    return Graphics.getRGB(code);
}
    
function setBlur(shape, radius) {
    var blurFilter = new BlurFilter(0, 0, 2);
    var rect = new Rectangle();
    rect.x = rect.y = - radius;
    rect.width = rect.height = radius * 2;
    
    blurFilter.blurX = blurFilter.blurY = radius / 2; 
    shape.filters = [blurFilter];
    shape.cache(rect.x, rect.y, rect.width, rect.height);
}

function beginLoadBitmap(object, imageUrl, position, center) {
    var image = new Image();
    image.src = imageUrl;
    image.initialPosition = position;
    image.initialCenter = center;
    image.onload = bitmapLoaded;
    image.object = object;
}

function bitmapLoaded(event) {
    var object = event.target;
    var image = new Bitmap(object);
    var hitObject = new Shape();
    hitObject.graphics.beginFill("#000000").drawRect(0, 0, image.image.width, image.image.height);
    image.hitArea = hitObject;
    stage.addChild(image);
    image.x = object.initialPosition.x; 
    image.y = object.initialPosition.y;
    image.regX = object.initialCenter.x;
    image.regY = object.initialCenter.y;
    stage.update();
    
    image.on("mousedown", function (event) {
        var clickPoint = new Point(event.stageX, event.stageY);
        var localPoint = this.globalToLocal(clickPoint.x, clickPoint.y);
        this.globalClickPoint = clickPoint;
        this.localClickPoint = localPoint;
        this.initialPosition = new Point(this.x, this.y);
        stage.update();
    });
    
    image.on("pressmove", function (event) {
        this.x = event.stageX;
        this.y = event.stageY;    
        stage.update(); 
        var offsetX = event.stageX - this.clickPoint.x;
        var offsetY = event.stageY - this.clickPoint.y;
        stage.update();
    });
    
    object.imageObject = image;
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
    var color = Graphics.getRGB(randomColor());
    shape.graphics.beginFill(color).drawCircle(x, y, radius);
    shape.on("mousedown", function (event) {
        this.offset = new Point(this.x - event.stageX, this.y - event.stageY);
    });
                  
    shape.on("pressmove", function (event) {
        this.x = event.stageX + this.offset.x;
        this.y = event.stageY + this.offset.y;
        stage.update();    
    });
    
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

    stage.addChild(sprite);
    Ticker.timingMode = createjs.Ticker.RAF;
    Ticker.addEventListener("tick", stage);
}  