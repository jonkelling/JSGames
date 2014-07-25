
define(['destroyable', 'AsteraxSprite', 'loadout', 'bullet', 'TailEmitter', 'TailEmitterParticle'], function(Destroyable, AsteraxSprite, Loadout, Bullet, TailEmitter, TailEmitterParticle) {

    var tailEmitterLifespan = 350;
    var tailEmitterEase = Phaser.Easing.Quadratic.In;
	
	var module = function(moduleName, spriteKey, tailSpriteKey)
	{
		Destroyable.call(this);

        this.config = Loadout.getWeaponByModuleName(moduleName);
		
		this.moduleName = moduleName;
		this.spriteKey = spriteKey || this.config.spriteKey || 'bullet';
		this.tailSpriteKey = tailSpriteKey || this.config.tailSpriteKey;
		this.canFire = true;
		this.skipOneShot = false;
		
//		this.ship = app.player.ship;
		
		this.group = game.add.group();
		
		this.group.enableBody = true;
		this.group.physicsBodyType = Phaser.Physics.P2JS;
		this.group.classType = this.getBulletClass();
		
		this.loadWeaponMods([1]);

		this.destroyables.push(this.group);
	};
	
	module.prototype = Object.create(Destroyable.prototype);
	module.prototype.constructor = module;
	
	module.prototype.loadWeaponMods = function(modIds)
	{
		var mods = [];
		modIds.sort(function(a, b) {
			a = parseInt(a);
			b = parseInt(b);
			return a == b ?  0 :
			       a <  b ? -1 :
			       a >  b ?  1 : 0;
		});

		for (var i = 0; i < modIds.length; i++) {
			mods.push(Loadout.getWeaponMod(modIds[i]));
		}

		// var defaults = Loadout.getWeaponMod(1);
		// 
		// this.safe = defaults.safe;
		// this.mass = defaults.mass;
		// this.fireRate = defaults.fireRate;
		// this.maxLiveBullets = defaults.maxLiveBullets;
		// this.speed = defaults.speed;
		// this.lifespan = defaults.lifespan;
		// this.automatic = defaults.automatic;

		for (var i = 0; i < mods.length; i++) {
			var mod = mods[i];
			if (mod.safe != undefined) { this.safe = mod.safe; }
			if (mod.mass != undefined) { this.mass = mod.mass; }
			if (mod.fireRate != undefined) { this.fireRate = mod.fireRate; }
			if (mod.maxLiveBullets != undefined) { this.maxLiveBullets = mod.maxLiveBullets; }
			if (mod.speed != undefined) { this.speed = mod.speed; }
			if (mod.lifespan != undefined) { this.lifespan = mod.lifespan; }
			if (mod.automatic != undefined) { this.automatic = mod.automatic; }
		}
		
		this.group.removeAll();
		if (this.group.length == 0)
		{
			this.createSprites();
			this.group.forEach(setupNewBullet, this);
		}
	};
	
	module.prototype.update = function()
	{
		this.group.forEachExists(_bulletUpdate, this);
	};
	
	module.prototype.createSprites = function()
	{
		this.group.createMultiple(this.maxLiveBullets, this.spriteKey);
	};
	
	module.prototype.fire = function(force)
	{
		var nextBullet = this.group.getFirstDead();
		
		if (!nextBullet)
		{
			this.skipOneShot = true;
		}
		else
		{
			if (this.canFire || force) {
				this.canFire = false;

				if (!force)
				{
					game.time.events.add(this.fireRate, setCanFire, this);
				}

				if (this.skipOneShot && !force)
				{
					this.skipOneShot = false;
					//return;
				}
				this.skipOneShot = false;

                this.beforeFire(nextBullet);

				nextBullet.reset(this.ship.x, this.ship.y);
                nextBullet.revive();

				this.setupNextBullet(nextBullet);
				this.currentBullet = nextBullet;
				this.afterFire(nextBullet);
			}
		}

        return nextBullet;
	};
	
	module.prototype.setupNextBullet = function(nextBullet)
	{
		nextBullet.lifespan = this.lifespan;
		nextBullet.body.gravityScale = 0;
		nextBullet.body.damping = 0;
		nextBullet.body.angularDamping = 0;
		nextBullet.body.mass = this.mass;
		
		nextBullet.body.angle = this.ship.body.angle;
		nextBullet.body.moveForward(this.speed);
		nextBullet.body.data.velocity[0] += this.ship.body.data.velocity[0];
		nextBullet.body.data.velocity[1] += this.ship.body.data.velocity[1];
	};

	module.prototype.beforeFire = function(bullet)
	{
	};
	
	module.prototype.afterFire = function(bullet)
	{
		bullet.fireTime = game.time.now;
		bullet.firePosition = bullet.position.clone();
	};
	
	module.prototype.bulletUpdate = function(bullet)
	{
	};
	
	module.prototype.aliveBulletUpdate = function(bullet)
	{
		var timeDiff = game.time.now - bullet.fireTime;
		app.debug.writeDebug3(timeDiff + ": " + bullet.firePosition.distance(bullet.position));
		app.debug.writeDebug4(bullet.speed);
	};
	
	module.prototype.deadBulletUpdate = function(bullet)
	{
	};
	
	module.prototype.beforeHitRock = function(bullet, rock)
	{
	};
	
	module.prototype.afterHitRock = function(bullet, rock)
	{
	};
	
	module.prototype.getBulletClass = function()
	{
		return Bullet;
	};
	
	module.prototype.bulletKilled = function(bullet)
	{
	};
	
	Object.defineProperty(module.prototype, "prop", {
		get: function() { return null; },
		set: function(value) { }
	});
	
	Object.defineProperty(module.prototype, "pxm", {
		get: function() {
			return game.physics.p2.pxm(this.speed);
		}
	});

    Object.defineProperty(module.prototype, "ship", {
        get: function() {
            return app.player.ship;
        }
    });
	
	return module;
	
	function setCanFire()
	{
		this.canFire = true;
	}
	
	function _bulletUpdate(bullet)
	{
		this.bulletUpdate(bullet);
		bullet.alive ? this.aliveBulletUpdate(bullet)
		             : this.deadBulletUpdate(bullet);
	}
	
	function _bulletKilled(bullet)
	{
		this.bulletKilled(bullet);
	}
	
	function setupNewBullet(bullet)
	{
		bullet.weapon = this;
		bullet.events.onKilled.add(_bulletKilled, this);

        if (bullet.weapon.tailSpriteKey)
        {
            bullet.tailEmitter = game.particles.add(new TailEmitter(game));
            bullet.tailEmitter.classType = TailEmitterParticle;
            bullet.tailEmitter.tailedSprite = bullet;
            bullet.tailEmitter.makeParticles(bullet.weapon.tailSpriteKey);
            bullet.tailEmitter.setAlpha(0.7, 0.0, tailEmitterLifespan, tailEmitterEase);
            bullet.tailEmitter.allowRotation = false;
            bullet.tailEmitter.start(false, tailEmitterLifespan, 5);
        }
	}


	
});