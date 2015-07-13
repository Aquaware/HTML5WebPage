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
        loadImageFromFile(file, addImage); 
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
    drawImage(bitmap);
}

function addImage(image) {
    drawImage(image);
}

function init() {
    canvas = document.getElementById("layer1");
    stage = new Stage(canvas);
    Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;
       
//    var image = new createjs.Image();
//    image.src = "./images/3m.jpg";
//    //image.src = "http://www.ics-web.jp/demos/130215_createjs_monariza/img/monariza.jpg";
//    image.crossOrigin = "Anonymous";
//    image.onload = draw;
}

function draw(event) {
    drawImage(this);
}

function drawImage(bitmapImage) {
    var bitmap = new Bitmap(bitmapImage);
    var width = bitmap.getBounds().width;
    var height = bitmap.getBounds().height;
    
    //var originalCanvas = document.getElementById("original");
    var originalCanvas = document.createElement('canvas');
    originalCanvas.setAttribute("width", width );
    originalCanvas.setAttribute("height", height);
    
    var original = new Stage(originalCanvas);
    original.addChild(bitmap);

    var context = original.canvas.getContext("2d");
    original.update();
    
    
    var unit = 8;
    var yMax = Math.floor((height - unit * 2) / unit);
    var xMax = Math.floor((width - unit * 2) / unit);
    var shape = new Shape();
    
    for( var repeat = 0; repeat < 3; repeat++ ) {
        for( var j = 0; j < yMax; j++ ) {
            for( var i = 0; i < xMax; i++ ) {
                var x = unit + i * unit;
                var y = unit + j * unit;
                var tx = Math.floor(x + 0.2 * unit * Math.random());
                var ty = Math.floor(y + 0.2 * unit * Math.random());
                var data = context.getImageData(tx, ty, 1, 1).data;
                var color = createjs.Graphics.getRGB(data[0], data[1], data[2], 0.3);
                var px = Math.floor(x +  unit * Math.random());
                var py = Math.floor(y +  unit * Math.random());
                var r = unit * (Math.random() + 0.5);
                shape.graphics.beginFill(color);
                shape.graphics.drawCircle(tx, ty, r);
                shape.graphics.endFill();
            }
        }
    }
    
    stage.addChild(shape);
    stage.update();
}
