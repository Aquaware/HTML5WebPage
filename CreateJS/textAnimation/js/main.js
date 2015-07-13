(function(window) {
    var instance;
    var canvas;
	var stage;
	var container;
    var timelines = [];
    
    function TextAnimation(canvasID) {
		if (instance) {
			return instance;
		}
        
		try {
			document.createElement("canvas").getContext("2d");
		} catch (e) {
			return;
		}
        
		instance = this;
		canvas = document.getElementById(canvasID);
		stage = new Stage(canvas);
		container = new Container();
		stage.addChild(container);
		Ticker.setFPS(60);
		Ticker.addEventListener("tick", tick);
	}
    
    TextAnimation.prototype.addText = function(words) {
        var textArray = createText(words);
        var timeline = createTimeline(textArray, complete);
        timelines.push(timeline);
	};
    
    TextAnimation.prototype.play = function() {
		var timeline = timelines[0];
		timeline.gotoAndPlay("entry");
	};
    
    function createText(words) {
        var chars = [];
        var textArray = [];
        var space = 5;
        var x = 0;
        var y = 100;
        for(var i = 0; i < words.length; i++) {
            var c = words.charAt(i);
            var t = new Text(c, "24px Arial", "#44ee44");
            t.x = x;
            t.y = y;
            x += t.getMeasuredWidth() + space;
            container.addChild(t);
            chars[i] = t;
        }
        textArray.push(chars);
        return textArray;
    }
    
    function createTimeline(textArray, callbackComplete) {
		var timeline = new Timeline([], {entry:0}, {paused:true, useTicks:true});
		var text = textArray[textArray.length - 1]
		for (var i = 0; i < text.length; ++i) {
			var t = text[i];
			var tween = Tween.get(t);
            tween.wait(i * 6)
			     .to({y:-10, scaleY:2}, 24, Ease.circOut)
			     .to({y:0, scaleY:1}, 24, Ease.backInOut);
			if (i === text.legnth - 1) {
				tween.call(callbackComplete, ["entry"], instance);
			}
			tween.wait((text.length - 1) * 6)
                 .to({y:-10, scaleY:0.5}, 24, Ease.sineOut)
			     .wait(6)
			     .to({y:-500, scaleY:2}, 48, Ease.circOut);
			if (i === text.length - 1) {
				tween.call(callbackComplete, ["exit"], instance);
			}
			timeline.addTween(tween);
		}
		timeline.addLabel("exit", (text.length - 1) * 6 + 48);
        
        return timeline;
	}
    
    function complete(key) {
		var timeline = timelines[0];
		timeline.setPaused(true);
		switch (key) {
			case "entry" :
				canvas.addEventListener("click", clicked, false);
				break;
			case "exit" :
				timeline = timelines[0];
				timeline.gotoAndPlay("entry");
				break;
		}
	}
    
    function clicked(e) {
		canvas.removeEventListener("click", clicked, false);
		var timeline = timelines[0];
		timeline.gotoAndPlay("exit");
	}
    
    function tick(event) {
        stage.update();    
    }
    
    window.TextAnimation = TextAnimation;
    
}(window));

window.addEventListener("load", function(e) {
	window.removeEventListener("load", arguments.callee, false);
	var main = new TextAnimation("myCanvas");
	main.addText("CreateJS");
//	main.addWord("TweenJS");
//	main.addWord("Timeline");
	main.play();
}, false);

