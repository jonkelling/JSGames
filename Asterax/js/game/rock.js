
define(['AsteraxSprite'], function(AsteraxSprite) {

	var module = function(game, x, y, name, rockSize)
	{
		AsteraxSprite.call(this, game, x, y, name);
		
		this.name = name;
		this.rockSize = rockSize;
		
		this.canHitShip = true;
		
		this.create();
	};

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
	
	module.prototype.setRockAngleAndVelocityFromBaseRock = function(baseRock, sideWaysDirection)
	{
		var baseVelocity = baseRock.body.velocity;
		
		this.body.data.velocity[0] = baseVelocity.x;
		this.body.data.velocity[1] = baseVelocity.y;
		
		this.body.rotation = Math.atan2(baseVelocity.x, baseVelocity.y) * -1;
 		this.body.rotation += game.rnd.frac() * sideWaysDirection;
		this.body.moveForward(Math.abs(getRandomVelocityForRock()));
		this.body.rotation = baseRock.body.rotation;
		
		return this;
	};
	
	return module;
	
	function getRandomVelocityForRock() {
		var x = game.rnd.integerInRange(20, 90);
		var n = 1 - (2 * game.rnd.integerInRange(0, 1)); // 1 or -1
		return x * n;
	}
	
	function onKilled()
	{
		runNewExplosionEmitter.call(this, ['white-smoke','fire3']);
		
		if (this.rockSize == app.rockSize.SMALL)
		{
			return;
		}
		else
		{	
			var nextSize = this.rockSize - 1;
			var group = app.rockGroupController.rocks;//getNewGroup(app.rockGroupController.rocks);
			
			if (this.rockSize == app.rockSize.MEDIUM)
			{
				var numberOfSmallRocksToCreate = game.rnd.integerInRange(1, 2);
				for (var i = 0; i <= numberOfSmallRocksToCreate; i++)
				{
					group.create(this.x, this.y, "rock_sm" + i, nextSize).setRockAngleAndVelocityFromBaseRock(this,  game.rnd.integerInRange(-1, 1));
				}
			}
			else if (this.rockSize == app.rockSize.LARGE)
			{
				var json = game.cache.getJSON("rockpositions");
				var rockNames = [this.name + "_med0", this.name + "_med1", this.name + "_med2"];
				var points = [];
				for (var i = 0; i < rockNames.length; i++) {
					var jsonEntry = json[rockNames[i]];
					
					if (!jsonEntry)
						points.push(this.position.clone());
					else
					{
						points.push(this.position.clone().add(-this.width/2, -this.height/2));
						points[i].x += jsonEntry.origin[0] + (jsonEntry.size[0] / 2);
						points[i].y += jsonEntry.origin[1] + (jsonEntry.size[1] / 2);
						points[i].rotate(this.x, this.y, points[i].angle(this.position)+Math.PI+this.body.rotation);
					}
				}
				
				var r0 = group.create(points[0].x, points[0].y, rockNames[0], nextSize).setRockAngleAndVelocityFromBaseRock(this, -1);
				var r1 = group.create(points[1].x, points[1].y, rockNames[1], nextSize).setRockAngleAndVelocityFromBaseRock(this, game.rnd.integerInRange(-1, 1));
				var r2 = group.create(points[2].x, points[2].y, rockNames[2], nextSize).setRockAngleAndVelocityFromBaseRock(this, +1);
				
				// game.time.events.add(300, runNewExplosionEmitter, r0, ['white-smoke']);
				// game.time.events.add(400, runNewExplosionEmitter, r1, ['white-smoke']);
				// game.time.events.add(500, runNewExplosionEmitter, r2, ['white-smoke']);
				
				runNewExplosionEmitter.call(r0, ['white-smoke']);
				runNewExplosionEmitter.call(r1, ['white-smoke']);
				runNewExplosionEmitter.call(r2, ['white-smoke']);
			}
		}
	}
	
	function runNewExplosionEmitter(images)
	{
		var image = game.cache.getImage(images[0]);
		
		var emitter = game.add.emitter(this.x, this.y, 6);
		
		emitter.makeParticles(images);
		emitter.makeParticles();
		
		var speed = 100;
		// var scale =	this.rockSize == app.rockSize.LARGE	? 0.4 :
		// 			this.rockSize == app.rockSize.MEDIUM	? 0.3 :
		// 			this.rockSize == app.rockSize.SMALL	? 0.1 : 0.1;
		var scale = this.width / image.width;
		
		var alpha = 0.0;
		var duration =	this.rockSize == app.rockSize.LARGE	? 450 :
						this.rockSize == app.rockSize.MEDIUM	? 350 :
						this.rockSize == app.rockSize.SMALL	? 250 : 250;
		
		emitter.minParticleSpeed.setTo(-speed, -speed);
		emitter.maxParticleSpeed.setTo(speed, speed);
		emitter.setAlpha(1, alpha, duration);
		emitter.gravity = 0;
		emitter.setScale(scale, scale*3, scale, scale*3, 100);
		emitter.start(true, duration, 0, 6);
	}

});
