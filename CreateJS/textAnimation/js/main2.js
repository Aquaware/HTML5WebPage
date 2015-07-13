var TextAnimation = (function(window) {
	var _instance;
	var _canvas;
	var _centerX;
	var _centerY;
	var _stage;
	var _container;
	var _texts_array = [];
	var _timelines = [];
	var _font;
	var _fontSize;
	var _color;
	var _letterSpacing;
	var _currentIndex = 0;
	
	function TextAnimation(canvasID, fontFamily, fontSize, color, letterSpacing) {
		if (_instance) {
			return _instance;
		}
		try {
			document.createElement("canvas").getContext("2d");
		} catch (e) {
			return;
		}
		_instance = this;
		_canvas = document.getElementById(canvasID);
		_centerX = _canvas.width >> 1;
		_centerY = _canvas.height >> 1;
		_stage = new Stage(_canvas);
		var _fontFamily = fontFamily || "Consolas";
		_fontSize = fontSize || 100;
		_font = _fontSize + "px " + _fontFamily;
		_color = color || "#666666";
		_letterSpacing = letterSpacing || 64;
		_container = new Container();
		_container.x = _centerX;
		_container.y = _centerY + (_fontSize >> 1);
		_stage.addChild(_container);
		Ticker.setFPS(60);
        //Ticker.addListener("tick", this);`
		Ticker.addListener(_stage);
	}
	
	var p = TextAnimation.prototype;
	
	p.addWord = function(word) {
		createText(word);
	};
	
	p.play = function() {
		var timeline = _timelines[_currentIndex];
		timeline.gotoAndPlay("entry");
	};
	
	function createText(word) {
		var l = word.length;
		var centeringValue = (_letterSpacing * (l - 1)) >> 1;
		var texts = [];
		for (var i = 0; i < l; ++i) {
			var str = word.substring(i, i + 1);
			var text = new Text(str, _font, _color);
			text.textAlign = "center";
			text.textBaseline = "bottom";
			text.x = _letterSpacing * i - centeringValue;
			text.y = _canvas.height;
			text.scaleY = 0;
			_container.addChild(text);
			texts[i] = text;
		}
		_texts_array.push(texts);
		createTimeline();
	}
	
	function createTimeline() {
		var timeline = new Timeline([], {entry:0}, {paused:true, useTicks:true});
		var texts = _texts_array[_texts_array.length - 1];
		var l = texts.length;
		for (var i = 0; i < l; ++i) {
			var text = texts[i];
			var tween = Tween.get(text)
			.wait(i * 6)
			.to({y:-10, scaleY:2}, 24, Ease.circOut)
			.to({y:0, scaleY:1}, 24, Ease.backInOut);
			if (i === l - 1) {
				tween.call(tweenComplete, ["entry"], _instance);
			}
			tween.wait((l - 1) * 6)
			.to({y:-10, scaleY:0.5}, 24, Ease.sineOut)
			.wait(6)
			.to({y:-_canvas.height, scaleY:2}, 48, Ease.circOut);
			if (i === l - 1) {
				tween.call(tweenComplete, ["exit"], _instance);
			}
			timeline.addTween(tween);
		}
		timeline.addLabel("exit", (l - 1) * 6 + 48);
		_timelines.push(timeline);
	}
	
	function tweenComplete(label) {
		var timeline = _timelines[_currentIndex];
		timeline.setPaused(true);
		switch (label) {
			case "entry" :
				_canvas.addEventListener("click", clickHandler, false);
				break;
			case "exit" :
				_currentIndex = (_currentIndex < _timelines.length - 1) ? ++_currentIndex : 0;
				timeline = _timelines[_currentIndex];
				timeline.gotoAndPlay("entry");
				break;
		}
	}
	
	function clickHandler(e) {
		_canvas.removeEventListener("click", clickHandler, false);
		var timeline = _timelines[_currentIndex];
		timeline.gotoAndPlay("exit");
	}
	
	return TextAnimation;
}(window));

window.addEventListener("load", function(e) {
	window.removeEventListener("load", arguments.callee, false);
	var main = new TextAnimation("myCanvas");
	main.addWord("CreateJS");
	main.addWord("TweenJS");
	main.addWord("Timeline");
	main.play();
}, false);