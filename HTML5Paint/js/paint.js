(function(){


var $canvas = $('#pane');
var $document = $(document);
var drawing = false;
var left = $canvas.prop('offsetLeft');
var top = $canvas.prop('offsetTop');

$canvas.on('mousedown', function(event) {
    drawing = true;
});

$canvas.on('mousedown', function(event) {
    drawing = true;
});

$canvas.on('mousemove', function(event) {
    if(drawing) {
        console("描画中");
    };
});

// initilize
$(function() {
	
});

})();