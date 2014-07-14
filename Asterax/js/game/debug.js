
define(['Phaser'], function () {

	var module = function() {
	};
	
	module.prototype =
	{
		constructor: module,
		
		roundPoint: function (p) {
			return [Math.round(p.x), Math.round(p.y)];
		}
		,
		
		writeDebug2: function (texts) {
			for (var i = 0; i < texts.length; i++) {
				var y = i * 18;
				game.debug.text(texts[i]+"", 450, 450 + y);
			}
		}
		,
		
		writeDebug: function (texts) {
			for (var i = 0; i < texts.length; i++) {
				var y = i * 18;
				game.debug.text(texts[i]+"", 20, 450 + y);
			}
		}
		,
		
		writeDebug3: function (text) {
			$('#debugdiv3').html(text);
		}
		,
		
		writeDebug4: function (text) {
			$('#debugdiv4').html(text);
		}
	};
	
	return new module();
});
