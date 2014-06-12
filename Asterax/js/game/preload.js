

function preload() {
	
	game.load.spritesheet('ship', 'images/ship/Ship.png', 64, 64);
	game.load.image('rock0', 'images/rocks/asteroid_3ds.png', 75, 75);
	game.load.image('rock1', 'images/rocks/badking.png', 75, 75);
	game.load.image('rock2', 'images/rocks/lutetia.png', 75, 75);
	game.load.image('rock3', 'images/rocks/vesta.png', 75, 75);
	
	
	game.load.physics('ship', 'assets/physics/shipSprites.json');
	game.load.physics('rocks', 'assets/physics/rockSprites.json');
	
}

