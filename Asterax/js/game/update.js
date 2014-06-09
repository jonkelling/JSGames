
function update() {
	
	app.player.update();
	app.rockGroupController.update();
	
	game.physics.ninja.collide(app.player.ship.ship, app.rockGroupController.rocks);
	
	// app.player.ship.body.bounce.set(1);
	// app.rockGroupController.rocks.forEachAlive(function(r) { r.body.bounce.set(-1); });
	// 
	// game.physics.arcade.collide(app.player.ship.ship, app.rockGroupController.rocks);
}

function moveTowardGreaterNumber(a, b, x)
{
	
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

function screenWrap (sprite, partial) {
	if (sprite.x < 0)
	{
		if (!partial)
			sprite.x = game.width;
		else
			return new Phaser.Point(game.width, sprite.y);
	}
	else if (sprite.x > game.width)
	{
		if (!partial)
			sprite.x = 0;// - sprite.width;
		else
			return new Phaser.Point(0, sprite.y);
	}

	if (sprite.y < 0)
	{
		if (!partial)
			sprite.y = game.height;
		else
			return new Phaser.Point(sprite.x, game.height);
	}
	else if (sprite.y > game.height)
	{
		if (!partial)
			sprite.y = 0;// - sprite.height;
		else
			return new Phaser.Point(sprite.x, 0);
	}
}

