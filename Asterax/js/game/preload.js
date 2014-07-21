define(['Phaser'], function () {
	return function()
	{
		game.load.spritesheet('ship', 'images/ship/Ship.png', 64, 64);
		game.load.image('shield', 'images/shield.png', 89, 89);
		game.load.image('rock0', 'images/rocks/asteroid_3ds.png', 75, 75);
		game.load.image('rock1', 'images/rocks/badking.png', 75, 75);
		game.load.image('rock2', 'images/rocks/lutetia.png', 75, 75);
		game.load.image('rock3', 'images/rocks/vesta.png', 75, 75);
		
		game.load.image('rock0_med0', 'images/rocks/asteroid_3ds_med0.png', 27, 29);
		game.load.image('rock0_med1', 'images/rocks/asteroid_3ds_med1.png', 40, 28);
		game.load.image('rock0_med2', 'images/rocks/asteroid_3ds_med2.png', 35, 29);
		
		game.load.image('rock1_med0', 'images/rocks/rock1_med0.png', 38, 37);
		game.load.image('rock1_med1', 'images/rocks/rock1_med1.png', 39, 32);
		game.load.image('rock1_med2', 'images/rocks/rock1_med2.png', 37, 35);
		
		game.load.image('rock2_med0', 'images/rocks/rock2_med0.png', 41, 30);
		game.load.image('rock2_med1', 'images/rocks/rock2_med1.png', 33, 34);
		game.load.image('rock2_med2', 'images/rocks/rock2_med2.png', 34, 29);
		
		game.load.image('rock3_med0', 'images/rocks/rock3_med0.png', 36, 33);
		game.load.image('rock3_med1', 'images/rocks/rock3_med1.png', 31, 38);
		game.load.image('rock3_med2', 'images/rocks/rock3_med2.png', 45, 24);
		
		game.load.image('rock_sm0', 'images/rocks/rock_sm0.png', 15, 14);
		game.load.image('rock_sm1', 'images/rocks/rock_sm1.png', 17, 14);
		game.load.image('rock_sm2', 'images/rocks/rock_sm2.png', 16, 15);
		game.load.image('rock_sm3', 'images/rocks/rock_sm3.png', 17, 15);
		
		game.load.image('fire1', 'assets/particles/fire1.png');
		game.load.image('fire2', 'assets/particles/fire2.png');
		game.load.image('fire3', 'assets/particles/fire3.png');
		game.load.image('muzzleflash2', 'assets/particles/muzzleflash2.png');
		game.load.image('muzzleflash3', 'assets/particles/muzzleflash3.png');
		game.load.image('muzzleflash7', 'assets/particles/muzzleflash7.png');
		game.load.image('smoke-puff', 'assets/particles/smoke-puff.png');
		game.load.image('white-smoke', 'assets/particles/white-smoke.png');
		game.load.image('yellow', 'assets/particles/yellow.png');
		game.load.spritesheet('grayscale', 'assets/particles/grayscale.png', 1, 1);
		
		
		game.load.image('bullet', 'images/bullet.png');
        game.load.image('bullet-white', 'images/bullet-white.png');
        game.load.image('bullet-white-tail', 'images/bullet-white-tail.png');

		game.load.image('background', 'images/backgrounds/galaxy-starry-night.jpg');
		
		
		game.load.physics('ship', 'assets/physics/shipSprites.json');
        game.load.physics('rocks', 'assets/physics/rockSprites.json');
        game.load.physics('bullets', 'assets/physics/bulletSprites.json');

		game.load.json('rockpositions', 'assets/rockSpritePositions.json');
		game.load.json('config', 'assets/config.json');
	};
});