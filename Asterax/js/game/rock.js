
define(['AsteraxSprite'], function(AsteraxSprite) {

	var module = function(game, x, y, name, rockSize)
	{
		AsteraxSprite.call(this, game, x, y, name);
		
		this.name = name;
		this.rockSize = rockSize;
		
		this.canHitShip = true;
		
		this.create();
	}

	module.prototype = Object.create(AsteraxSprite.prototype);
	module.prototype.constructor = module;

	module.prototype.create = function()
	{
		var baseVelocity = new Phaser.Point(getRandomVelocityForRock(), getRandomVelocityForRock());
		this.body.velocity.x = baseVelocity.x;
		this.body.velocity.y = baseVelocity.y;

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
		
		this.events.onKilled.add(onKilled, this);

		this.body.debug = app.showPolygons;
	};

	module.prototype.update = function()
	{
	};
	
	module.prototype.setRockAngleAndVelocityFromBaseRock = function(baseRock)
	{
		var baseVelocity = baseRock.body.velocity;
		
		this.body.data.velocity[0] = baseVelocity.x;
		this.body.data.velocity[1] = baseVelocity.y;
		
		//this.angle = Math.atan2(baseVelocity.x, baseVelocity.y);
		this.body.moveForward(getRandomVelocityForRock());
	};
	
	return module;
	
	function getRandomVelocityForRock() {
		var x = game.rnd.integerInRange(20, 90);
		var n = 1 - (2 * game.rnd.integerInRange(0, 1)); // 1 or -1
		return x * n;
	}
	
	function onKilled()
	{
		if (this.rockSize == app.rockSize.SMALL)
		{
			return;
		}
		else
		{
			var nextSize = this.rockSize - 1;
			var group = app.rockGroupController.rocks;
			
			if (this.rockSize == app.rockSize.MEDIUM)
			{
				var numberOfSmallRocksToCreate = game.rnd.integerInRange(1, 2);
				for (var i = 0; i <= numberOfSmallRocksToCreate; i++)
				{
					group.create(this.x, this.y, "rock_sm" + i, nextSize).setRockAngleAndVelocityFromBaseRock(this);
				}
			}
			else if (this.rockSize == app.rockSize.LARGE)
			{
				group.create(this.x, this.y, this.name + "_med0", nextSize).setRockAngleAndVelocityFromBaseRock(this);
				group.create(this.x, this.y, this.name + "_med1", nextSize).setRockAngleAndVelocityFromBaseRock(this);
				group.create(this.x, this.y, this.name + "_med2", nextSize).setRockAngleAndVelocityFromBaseRock(this);
			}
		}
	}

});