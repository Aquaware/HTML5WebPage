// class inherit method
function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}


function CJSize(width, height) {
    this.width = width;
    this.height = height;
}

function hslaToColor(hsla) {
    return Graphics.getHSL(hsla.h, hsla.s, hsla.l, hsla.a); 
}

function drawRect(rect, size, borderColor, fillColor, cornerRadius) {
    rect.graphics.beginStroke(hslaToColor(borderColor));
    rect.graphics.beginFill(hslaToColor(fillColor));
    rect.graphics.drawRoundRect(0, 0, size.width, size.height, cornerRadius);
}

function hsla() {
    var color = { h: 0, s: 0, l: 0, a: 0.0 };
    return color;
}

function loadBitmapFromFile(file, callback) {
    var bitmap;
    var reader = new FileReader();
    reader.onload = function (event) {
        var image = new createjs.Image();
        image.onload = function(event) {
            bitmap = new Bitmap(this);
            callback(bitmap);
        };
        image.src = reader.result; 
    };
    console.log(file);
    reader.readAsDataURL(file);
}

function loadImageQueue(manifest, callback) {
    var loader = new LoadQueue(false);
    
    loader.on("progress", function (event) {
    
    });
    
    loader.on("fileload", function (event) {
    
    });
    
    loader.on("complete", function (event) {
    
    });
              
	loader.loadManifest(manifest);    
}



// *** Base Class ***
// name: string
// tag: integer
function CJUIObject(stage) {
    this.stage = stage;
    this.body = new Container();
    this.shape = new Shape();
}
CJUIObject.prototype.setPosition = function setPosition(x, y) {
    this.body.x = x;
    this.body.y = y;
};
CJUIObject.prototype.update = function update() {
    this.stage.update();
};

function CJParts(stage, name, group, tag, appearance) {
    CJUIObject.call(this, stage);
    this.name = name;
    this.group = group;
    this.tag = tag;
    this.borderColor = appearance.borderColor;
    this.fillColor = appearance.fillColor;
}
inherits(CJParts, CJUIObject);

function CJCircle(stage, name, group, tag, appearance, radius) {
    CJParts.call(this, stage, name, group, tag, appearance);
    this.body = new Container();
    this.shape = new Shape();
    this.radius = radius;
    this.shape.graphics.beginStroke(hslaToColor(this.borderColor));
    this.shape.graphics.beginFill(hslaToColor(this.fillColor));
    this.shape.graphics.drawCircle(0, 0, radius);
    this.body.addChild(this.shape);
    this.stage.addChild(this.body);
    
    this.body.on("mousedown", function (event) {
        this.globalClickPoint = new Point(event.stageX, event.stageY);
        this.localClickPoint = this.globalToLocal(event.stageX, event.stageY);
        this.initialPosition = new Point(this.x, this.y);
        this.offset = new Point(this.x - event.stageX, this.y - event.stageY);
        this.stage.update();
    });
    
    this.body.on("pressmove", function (event) {
        this.x = event.stageX + this.offset.x;
        this.y = event.stageY + this.offset.y;
        this.stage.update();
    });
}
inherits(CJCircle, CJParts);

function CJButton(stage, name, group, tag, appearance, size, cornerRadius) {
    CJParts.call(this, stage, name, group, tag, appearance);
    
    this.size = size;
    this.cornerRadius = cornerRadius;
    drawRect(this.shape, size, this.borderColor, this.fillColor, cornerRadius);
    this.body.addChild(this.shape);
    this.stage.addChild(this.body);
}
inherits(CJButton, CJParts);

function CJTextButton(stage, name, group, tag, text, appearance, size, cornerRadius) {
    CJButton.call(this, stage, name, group, tag, appearance, size, cornerRadius);
    this.text = text;
    this.text.x = (size.width - text.getMeasuredWidth() )/ 2;
    this.text.y = (size.height - text.getMeasuredHeight() ) / 2;
    
    this.highlight = new Shape();
    var borderColor = { h: 0, s: 10, l: 30, a: 1.0 };
    borderColor.h = appearance.borderColor.h;
    var fillColor = borderColor;
    fillColor.h = appearance.fillColor.h;
    fillColor.s = 20;
    fillColor.l = 100;
    drawRect(this.highlight, size, borderColor, fillColor, cornerRadius);
        
    this.hit = new Shape();
    var color = hsla();
    color.a = 1.0;
    drawRect(this.hit, size, hsla(), color, cornerRadius);

    this.hit.highlight = this.highlight;
    this.hit.normal = this.shape;
    this.hit.body = this.body;
    this.hit.text = this.text;
    
    this.body.addChild(this.hit);
    this.body.addChild(this.highlight);
    this.body.addChild(this.shape);
    this.body.addChild(text);
    
    this.hit.on("mousedown", function (event) {
        //this.body.removeChild(this.normal);
        this.body.removeChild(this.text);
        CJUIObject.update();
    });
    
    this.hit.on("pressmove", function (event) {
        //this.body.removeChild(this.hightlit);
        //this.body.addChild(this.shape);
        //parent.update();
    });
}
inherits(CJTextButton, CJParts);


function CJRoundTextButton(stage, r, text, appearance) {
    var shadow = new Shadow("#000000",0,0,4);
	var button = new Container();
	var shape = new Shape();
	shape.graphics.beginFill(hslaToColor(appearance.fillColor)).drawCircle(0, 0, r);
	button.addChild(shape);
	button.shadow = shadow;
    //text.x = (r - text.getMeasuredWidth() )/ 2;
    //text.y = (r - text.getMeasuredHeight() ) / 2;
	text.textAlign = "center";
	text.textBaseline = "middle";
	text.shadow = shadow;
	button.addChild(text);
	//text.mask = shape;
    stage.addChild(button);
    stage.update();

	button.addEventListener("rollover",function () {
		shape.graphics.clear();
		shape.graphics.beginFill(hslaToColor(appearance.activeColor)).drawCircle(0 , 0, r);
		stage.update();
	});
	
	button.addEventListener("rollout",function () {
		shape.graphics.clear();
		shape.graphics.beginFill(hslaToColor(appearance.fillColor)).drawCircle(0, 0, r);
		stage.update();
	});
    
	return button;
}

function CJImageButton(stage, image, position, cornerRadius, appearance) {
    var shadow = new Shadow("#000000",0,0,4);
	var button = new Container();
	var shape = new Shape();
    
    var width = image.width;
    var height = image.height;
    
    
	shape.graphics.beginBitmapFill(image);
    shape.graphics.drawRoundRect(0, 0, width, height, cornerRadius);
    shape.regX = width / 2;
    shape.regY = height / 2;
    shape.name = "image";
    
    var hitObject = new Shape();
    hitObject.graphics.beginFill("#000000").drawRect(0, 0, width, height);
    shape.hitArea = hitObject;

	button.shadow = shadow;
    
    var outline=new Shape();
	outline.graphics.beginFill(hslaToColor(appearance.activeColor));
    outline.graphics.drawRoundRect(0, 0, width, height, cornerRadius);
	outline.name="back";

	outline.regX = width / 2;
	outline.regY = height / 2;
	
	button.shadow=shadow;
    button.addChild(outline);    
	button.addChild(shape);
    stage.addChild(button);
    
    button.x = position.x;
    button.y = position.y;
    stage.update();

	button.on("rollover",function () {
        shape.alpha = 1.0;
		stage.update();
	});
	
	button.on("rollout",function () {
        shape.alpha = 0.3;
		stage.update();
	});
    
	return button;
}

function CJTable(stage, rowMax, columnMax, cellSize) {
    CJUIObject.call(this, stage);
    this.rowMax = rowMax;
    this.columnMax = columnMax;
    
    var marginVertical = 2;
    var marginLeft = 18;
    var marginRight = 4;
    var verticalScrollBarWidth = 14;
    var width = rowMax * cellSize.width + marginLeft + marginRight + verticalScrollBarWidth;
    var tableHeight = columnMax * cellSize.height;
    var height = tableHeight + cellSize.height * 2 + marginVertical * 2;
    var tableOrigin = new Point( marginLeft, marginVertical + cellSize.height );
    
    // outline
    this.shape.graphics.beginStroke("#cccccc");
    this.shape.graphics.beginFill("#eeeeee");
    this.shape.graphics.drawRoundRect(this.body.x, this.body.y, width, height, 4);
    this.body.addChild(this.shape);
    
    this.table = new Container();
    this.table.x = tableOrigin.x;
    this.table.y = tableOrigin.y;
    this.table.yOffset = 0;
    this.table.columnOffset = 0;
    this.table.rowMax = rowMax;
    this.table.columnMax = columnMax;
    this.table.cellSize = cellSize;
    this.body.addChild(this.table);
    
    this.table.cells = DrawTable(stage, this.table, 0);
    
    // scrollbar
    var position = new Point( tableOrigin.x + rowMax * cellSize.width + 1, tableOrigin.y );
    this.scrollBar = new CJVScrollBar(stage, this.body, this.table, 0, position, 0.3,
                                            verticalScrollBarWidth, tableHeight, cellSize);
    this.stage.addChild(this.body);
    
    this.upperCover = new Shape();
    this.upperCover.graphics.beginFill("#eeeeee");
    this.upperCover.graphics.drawRect(0, marginVertical, width, cellSize.height);
    this.body.addChild(this.upperCover);
    
    this.lowerCover = new Shape();
    this.lowerCover.graphics.beginFill("#eeeeee");
    this.lowerCover.graphics.drawRect(0, tableOrigin.y + tableHeight, width, cellSize.height);
    this.body.addChild(this.lowerCover);
}
inherits(CJTable, CJUIObject);

function DrawTable(stage, table, values) {
    var appearance = [ 
                        {   borderColor:  {h: 100, s: 0, l: 100, a: 1.0},
                            fillColor:    {h: 100, s: 60, l: 70, a: 1.0}    }
                     ];
    
    var cells = new Array();
    for(var row = 0; row < table.rowMax; row++ ){
        cells[row] = new Array();
        for(var column = 0; column < table.columnMax + 1; column++) {
            var c = column + table.columnOffset;
            value = row + "," + c;
            cells[row][column] = new CJTableCell(stage, table, value, row, column, 0, appearance, table.cellSize);
        }
    }
    
    return cells;
};

function RemoveAllCells(table) {
    
    for(var row = 0; row < table.rowMax; row++ ){
        for(var column = 0; column < table.columnMax + 1; column++) {
            var cell = table.cells[row][column];
            table.removeChild(cell);
        }
    }    
}

function CJTableCell(stage, parent, value, row, column, select, appearance, cellSize) {
    CJUIObject.call(this, stage);
    this.cellSize = cellSize;
    this.row = row;
    this.column = column;
    this.borderColor = hslaToColor(appearance[select].borderColor);
    this.fillColor = hslaToColor(appearance[select].fillColor);
    this.shape.graphics.beginStroke(this.borderColor);
    this.shape.graphics.setStrokeStyle(0.2, "round");
    this.shape.graphics.beginFill(this.fillColor);
    this.shape.graphics.drawRect(this.body.x, this.body.y, cellSize.width, cellSize.height);
    this.body.addChild(this.shape);
    
    this.text = new Text(value, "9px Arial", "#000000");
    this.body.addChild(this.text);
    this.body.x = row * cellSize.width;
    this.body.y = column * cellSize.height + parent.yOffset;
    parent.addChild(this.body);
    
    this.text.on("mousedown", function (event) {
        this.globalClickPoint = new Point(event.stageX, event.stageY);
        this.localClickPoint = this.globalToLocal(event.stageX, event.stageY);
        this.initialPosition = new Point(this.x, this.y);
        this.offset = new Point(this.x - event.stageX, this.y - event.stageY);
        stage.update();
    });
    
    this.text.on("pressmove", function (event) {
        this.x = event.stageX + this.offset.x;
        this.y = event.stageY + this.offset.y;
        stage.update();
    });
}
inherits(CJTableCell, CJUIObject);

function CJVScrollBar(stage, parent, table, value, position, barLength, width, height, cellSize) {
    CJUIObject.call(this, stage);
    this.value = value;
    this.width = width;
    this.height = height;
    
    if(height <= 0) {
        return;
    }
    
    this.shape.graphics.beginStroke("#aaaaaa");
    this.shape.graphics.setStrokeStyle(0.2, "round");
    this.shape.graphics.beginFill("#dddddd");
    this.shape.graphics.drawRect(0, 0, width, height);
    this.body.addChild(this.shape);
    
    this.thumb = new Shape();
    var thumbColor = "#777777";
    this.thumb.graphics.beginFill(thumbColor);
    this.thumb.graphics.drawRoundRect(3, 1, width - 3 * 2, height * barLength, 4);
    this.body.addChild(this.thumb);
    
    this.thumb.on("mousedown", function (event) {
        this.globalClickPoint = new Point(event.stageX, event.stageY);
        this.localClickPoint = this.globalToLocal(event.stageX, event.stageY);
        this.initialPosition = new Point(this.x, this.y);
        this.offset = new Point(this.x - event.stageX, this.y - event.stageY);
        stage.update();
    });
    
    this.thumb.on("pressmove", function (event) {
        var newY = event.stageY + this.offset.y
        if(newY < 0) {
            newY = 0;
        }
        if(newY > (1 - barLength) * height - 1) {
            newY = (1 - barLength) * height - 1;
        }
        
        this.y = newY
        this.value = newY / height;
        delta = this.value * height;
        var columnOffset = Math.floor(delta / cellSize.height);
        table.y = cellSize.height - (delta - columnOffset * cellSize.height);
        if(table.columnOffset != columnOffset) {
            table.columnOffset = columnOffset;
            RemoveAllCells(table);
            table.cells = DrawTable(stage, table, 0);
        }
        stage.update();
    });
    
    this.body.x = position.x;
    this.body.y = position.y;
    parent.addChild(this.body);
}
inherits(CJVScrollBar, CJUIObject);
