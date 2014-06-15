
define(['AsteraxSprite'], function(AsteraxSprite) {

	var module = function(game, x, y, name, frame)
	{
		AsteraxSprite.call(this, game, x, y, name);
		
		this.name = name;
		this.rockSize = app.rockSize.LARGE;
		
		this.canHitShip = true;
		
		this.create();
	}

	module.prototype = Object.create(AsteraxSprite.prototype);
	module.prototype.constructor = module;

	module.prototype.create = function()
	{
		var velocity = new Phaser.Point(getRandomVelocityForRock(), getRandomVelocityForRock());
		this.body.velocity.x = velocity.x;
		this.body.velocity.y = velocity.y;

		while (Math.abs(this.body.angularVelocity) < 0.2)
			// 0.2 is effectively the min rotate speed here
			this.body.angularVelocity = game.rnd.normal();

		this.outOfBoundsKill = false;

		this.x2 = game.width / 2;
		this.y2 = game.height / 2;
		this.body.gravityScale = 0;
		this.body.angularDamping = 0;
		this.body.damping = 0;
		this.body.mass = 2;
		this.body.clearShapes();
		this.body.addPhaserPolygon('rocks', this.name);

		this.body.setCollisionGroup(app.rocksCollisionGroup);
		this.body.collides([app.shipCollisionGroup, app.bulletsCollisionGroup]);

		this.body.debug = app.showPolygons;
	};

	module.prototype.update = function()
	{
	};

	return module;
	
	function getRandomVelocityForRock() {
		var x = game.rnd.integerInRange(20, 90);
		var n = 1 - (2 * game.rnd.integerInRange(0, 1)); // 1 or -1
		return x * n;
	}

});