
define(['AsteraxSprite', 'loadout', 'bullet'], function(AsteraxSprite, Loadout, Bullet) {
	
	var module = function(moduleName)
	{
		this.moduleName = moduleName;
		this.spriteKey = 'bullet';
		this.canFire = true;
		this.skipOneShot = false;
		
		this.config = Loadout.getWeaponByModuleName(moduleName);
		
		this.ship = app.player.ship;
		
		this.loadWeaponMods([1]);
		
		this.group = game.add.group();
		
		this.group.enableBody = true;
		this.group.physicsBodyType = Phaser.Physics.P2JS;
		this.group.classType = this.getBulletClass();
	};
	
	module.prototype.constructor = module;
	
	module.prototype.loadWeaponMods = function(modIds)
	{
		var mods = [];
		modIds.sort();
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
	};
	
	module.prototype.update = function()
	{
		this.group.callAll('wrap');
		this.group.forEachExists(_bulletUpdate, this);
	};
	
	module.prototype.createSprites = function()
	{
		this.group.createMultiple(this.maxLiveBullets, this.spriteKey);
	};
	
	module.prototype.fire = function()
	{
		if (this.group.length == 0)
		{
			this.createSprites();
			this.group.forEach(setWeapon, this);
		}
		
		var nextBullet = this.group.getFirstExists(false);
		
		if (!nextBullet)
		{
			this.skipOneShot = true;
		}
		else
		{
			if (this.canFire) {
				this.canFire = false;
				game.time.events.add(this.fireRate, setCanFire, this);
				
				if (this.skipOneShot)
				{
					this.skipOneShot = false;
					return;
				}
				
				nextBullet.reset(this.ship.x, this.ship.y);
				
				this.beforeFire(nextBullet);
				this.setupNextBullet(nextBullet);
				this.currentBullet = nextBullet;
				this.afterFire(nextBullet);
			}
		}
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
	};
	
	module.prototype.bulletUpdate = function(bullet)
	{
	};
	
	module.prototype.aliveBulletUpdate = function(bullet)
	{
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
	
	Object.defineProperty(module.prototype, "prop", {
		get: function() { return null; },
		set: function(value) { }
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
	
	function setWeapon(bullet)
	{
		bullet.weapon = this;
	}
	
});