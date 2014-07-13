
define(['Phaser'], function () {
	
	window.roundPoint = function (p) {
		return [Math.round(p.x), Math.round(p.y)];
	}
	
	window.writeDebug2 = function (texts) {
		for (var i = 0; i < texts.length; i++) {
			var y = i * 18;
			game.debug.text(texts[i]+"", 450, 450 + y);
		}
	}
	
	window.writeDebug = function (texts) {
		for (var i = 0; i < texts.length; i++) {
			var y = i * 18;
			game.debug.text(texts[i]+"", 20, 450 + y);
		}
	}
	
	window.writeDebug3 = function (text) {
		$('#debugdiv3').html(text);
	}
	
	window.writeDebug4 = function (text) {
		$('#debugdiv4').html(text);
	}
	
	return function()
	{
		app.player.update();
		app.rockGroupController.update();
		
		if (!app.renderForOldDevice)
		{
			//  Scroll the background
			//app.background.tilePosition.x += app.backgroundSpeed;
		}
	};
});
