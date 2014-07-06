
define(['AsteraxSprite', 'AutoDestroySprite'], function(AsteraxSprite, AutoDestroySprite) {

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
		this.stats = game.cache.getJSON("config").rocks.stats[this.rockSize];
		
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
		this.body.mass = this.stats.mass;
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
		// runNewExplosionEmitter.call(this, ['muzzleflash2'], {
		// 		alphaEase:Phaser.Easing.Circular.InOut, 
		// 		quantity:1,		scale:0.6,	 	minAlpha:0.0,
		// 		speed:0.1, 		lifespan:500
		// 	});
		runNewExplosionEmitter.call(this, ['fire1',], {scale:0.4, minAlpha:0.0});
		
		if (game.device.webGL)
		{
			runNewExplosionEmitter2.call(this);
		}
		
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
				game.time.events.add(0, runNewExplosionEmitter, this, ['white-smoke',''], {scale:1.0, maxAlpha:0.17, lifespan:600, speed:100});
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
				
				game.time.events.add(0, runNewExplosionEmitter, r0, ['white-smoke',''], {scale:1.0, maxAlpha:0.25, lifespan:600, speed:100});
				game.time.events.add(0, runNewExplosionEmitter, r1, ['white-smoke',''], {scale:1.0, maxAlpha:0.25, lifespan:600, speed:100});
				game.time.events.add(0, runNewExplosionEmitter, r2, ['white-smoke',''], {scale:1.0, maxAlpha:0.25, lifespan:600, speed:100});
				
				if (game.device.webGL)
				{
					runNewExplosionEmitter2.call(r0, ['smoke-puff', 'white-smoke']);
					runNewExplosionEmitter2.call(r1, ['smoke-puff', 'white-smoke']);
					runNewExplosionEmitter2.call(r2, ['smoke-puff', 'white-smoke']);
				}
			}
		}
	}
	
	function runNewExplosionEmitter(images, options)
	{
		options = options || {};
		options.scale = options.scale || 1.0;
		options.maxAlpha = options.maxAlpha || 1.0;
		options.minAlpha = options.minAlpha || 0.0;
		options.alphaEase = options.alphaEase || Phaser.Easing.Linear.None;
		options.quantity = options.quantity || 6;
		options.lifespan =	options.lifespan != undefined ? options.lifespan :
							this.rockSize == app.rockSize.LARGE	? 250 :
							this.rockSize == app.rockSize.MEDIUM	? 350 :
							this.rockSize == app.rockSize.SMALL	? 250 : 250;
		options.speed = options.speed || 100;
		options.explode = options.explode == undefined ? true : options.explode;
		options.frequency = options.frequency || 250;
		
		var image = game.cache.getImage(images[0]);
		
		var emitter = game.add.emitter(this.x, this.y, options.quantity);
		
		emitter.makeParticles(images);
		
		var scale = options.scale * (this.width / image.width);
		
		emitter.minParticleSpeed.setTo(-options.speed, -options.speed);
		emitter.maxParticleSpeed.setTo(options.speed, options.speed);
		emitter.setAlpha(options.maxAlpha, options.minAlpha, options.lifespan, options.alphaEase);
		emitter.gravity = 0;
		emitter.setScale(scale, scale*3, scale, scale*3, 100);
		emitter.start(options.explode, options.lifespan, options.frequency, options.quantity);
		
		game.time.events.add(options.lifespan, destroyEmitter, emitter);
	}
	
	function runNewExplosionEmitter2()
	{
		var emitter = game.add.emitter(this.x, this.y, 15);
		//emitter.classType = AutoDestroySprite;
		
		var speed = 100;
		var duration = 600;
		
		emitter.makeParticles('grayscale', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
		emitter.minParticleSpeed.setTo(-speed, -speed);
		emitter.maxParticleSpeed.setTo(speed, speed);
		emitter.setAlpha(1, 0.0, duration*2, Phaser.Easing.Quadratic.In);
		// emitter.setScale(200, 200, 200, 200, 100);
		emitter.gravity = 0;
		emitter.start(true, duration*2, 0, 15);
		
		game.time.events.add(duration*2, destroyEmitter, emitter);
	}
	
	function destroyEmitter()
	{
		this.destroy();
	}

});
