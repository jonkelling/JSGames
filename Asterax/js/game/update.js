
function update() {
	
	app.player.update();
	app.rockGroupController.update();
	
	//  Scroll the background
	app.background.tilePosition.x += app.backgroundSpeed;
	
	// writeDebug([app.player.ship.body.velocity.x, app.player.ship.body.velocity.y]);
	// try {
	// 	writeDebug2([app.player.bullets.bullets.getFirstAlive().body.velocity.x, app.player.bullets.bullets.getFirstAlive().body.velocity.y]);
	// }
	// catch (ex) {
	// 	
	// }
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
