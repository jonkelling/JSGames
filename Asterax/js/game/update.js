

var player;
var cursors;
var maxSpeed = 250;
var turnSpeed = 200;
var decay = 1;
var acceleration = 400;
var bullets;

function update() {
	
	
}

function moveTowardGreaterNumber(a, b, x)
{
	
}

function roundPoint(p) {
	return [Math.round(p.x), Math.round(p.y)];
}

function setPlayerFrame() {
	var angle = player.angle < 0 ? player.angle + 360 : player.angle;
	while (angle >= 360)
		angle -= 360;
		
	var nextFrame = Math.round(angle / 6);
	if (nextFrame >= 60)
		nextFrame = 0;
		
	player.frame = nextFrame;
	
	
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

function screenWrap (sprite) {
	if (sprite.x < 0)
	{
		sprite.x = game.width;
	}
	else if (sprite.x > game.width)
	{
		sprite.x = 0;// - sprite.width;
	}

	if (sprite.y < 0)
	{
		sprite.y = game.height;
	}
	else if (sprite.y > game.height)
	{
		sprite.y = 0;// - sprite.height;
	}
}

