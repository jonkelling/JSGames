
function update() {
	
	app.player.update();
	app.rockGroupController.update();
	
	if (!app.renderForOldDevice)
	{
		//  Scroll the background
		//app.background.tilePosition.x += app.backgroundSpeed;
	}
}

function roundPoint(p) {
	return [Math.round(p.x), Math.round(p.y)];
}

function writeDebug2(texts) {
	for (var i = 0; i < texts.length; i++) {
		var y = i * 18;
		game.debug.text(texts[i]+"", 450, 450 + y);
	}
}

function writeDebug(texts) {
	for (var i = 0; i < texts.length; i++) {
		var y = i * 18;
		game.debug.text(texts[i]+"", 20, 450 + y);
	}
}

function writeDebug3(text) {
    $('#debugdiv3').html(text);
}

function writeDebug4(text) {
    $('#debugdiv4').html(text);
}