
define(['destroyable', 'AsteraxSprite', 'loadout', 'bullet', 'TailEmitter', 'TailEmitterParticle'], function(Destroyable, AsteraxSprite, Loadout, Bullet, TailEmitter, TailEmitterParticle) {

    var tailEmitterLifespan = 350;
    var tailEmitterEase = Phaser.Easing.Quadratic.In;
    var BEZIER = 1;
    var WRAP = 2;
	
	var module = function(parent, moduleName, spriteKey, tailSpriteKey)
	{
		Destroyable.call(this);

        this.config = Loadout.getWeaponByModuleName(moduleName);
		
		this.moduleName = moduleName;
		this.spriteKey = spriteKey || this.config.spriteKey || 'bullet';
		this.tailSpriteKey = tailSpriteKey || this.config.tailSpriteKey;
		this.canFire = true;
		this.skipOneShot = false;
		
//		this.ship = app.player.ship;
		
		this.group = game.add.group(parent);
		
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

        if (bullet.exists && bullet.alive && this.config.drawTail === true)
        {
            drawTail.call(bullet);
        }
	}
	
	function _bulletKilled(bullet)
	{
		this.bulletKilled(bullet);
        bullet.tailPoints = null;
        bullet.lastTailTime = null;
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

    function BezierPoint(p)
    {
        this.point = p.clone();
        this.controlPoint = null;
        this.type = BEZIER;
    }

    function trackTail()
    {
        var maxTailPoints = 3;
        var drawInterval = 80;
        var cp1CaptureInterval = 30;
        var cp2CaptureInterval = 60;

        this.trackTailWrapped = this.trackTailWrapped || this.events.onWrapped.add(function()
        {
        });

        this.lastTailTime = this.lastTailTime || this.game.time.now;
        this.tailPoints = this.tailPoints || new Phaser.LinkedList();

        var deltaTime = this.game.time.now - this.lastTailTime;

        if (this.tailPoints.last == null)
        {
            this.tailPoints.add(new BezierPoint(this.position));
            this.tailPoints.last.controlPoint = this.tailPoints.last.point;
        }
        else
        {
            if (this.tailPoints.last.controlPoint == null)
            {
                if (deltaTime >= cp1CaptureInterval)
                {
                    this.tailPoints.last.controlPoint = this.position.clone();
                }
            }
            else
            {
                if (deltaTime >= drawInterval)
                {
                    this.tailPoints.add(new BezierPoint(this.position));
                    this.lastTailTime = this.game.time.now;
                }
            }
        }

        if (this.tailPoints.total > maxTailPoints)
        {
            this.tailPoints.remove(this.tailPoints.first);
        }
    }

    function drawTail()
    {
        trackTail.call(this);

        var bmd = this.weapon.tailBitmapData;
        if (!this.weapon.tailBitmapData)
        {
            bmd = app.bmd = this.weapon.tailBitmapData = this.weapon.tailBitmapData || this.game.add.bitmapData(this.game.width, this.game.height);
            this.game.add.sprite(0, 0, bmd);
            bmd.context.strokeStyle = Phaser.Color.createColor(255, 255, 255, 0.9).rgba;
            bmd.context.lineWidth = 1;
            bmd.context.strokeThickness = 1;
        }

        bmd.clear();
        bmd.context.beginPath();
        this.tailPoints.callAll2(function(bz) {
            if (bz === this.tailPoints.first || bz.type == WRAP)
            {
                bmd.context.moveTo(bz.point.x, bz.point.y);
            }
            else
            {
                bmd.context.lineTo(bz.point.x, bz.point.y);
                if (bz === this.tailPoints.last)
                {
                    bmd.context.lineTo(this.position.x, this.position.y);
                }
            }
//            bmd.context.bezierCurveTo(this.lastTailPositionCP1.x, this.lastTailPositionCP1.y, cp2.x, cp2.y, this.x, this.y);
//            bmd.context.bezierCurveTo(this.lastTailPositionCP1.x, this.lastTailPositionCP1.y, this.lastTailPositionCP2.x, this.lastTailPositionCP2.y, this.x, this.y);
        }, this);
        bmd.context.stroke();
        bmd.dirty = true;
    }

    function drawTail2()
    {
    	return;
        var drawInterval = 100;
        var cp1CaptureInterval = 40;
        var cp2CaptureInterval = 60;
        trackTail.call(this);

        var bmd = this.weapon.tailBitmapData;
        if (!this.weapon.tailBitmapData)
        {
            bmd = app.bmd = this.weapon.tailBitmapData = this.weapon.tailBitmapData || this.game.add.bitmapData(this.game.width, this.game.height);
            this.game.add.sprite(0, 0, bmd);
            bmd.context.strokeStyle = Phaser.Color.createColor(255, 255, 255, 0.9).rgba;
            bmd.context.lineWidth = 1;
            bmd.context.strokeThickness = 1;
        }

        this.lastTailPosition = this.lastTailPosition || this.position.clone();
        this.lastTailPositionCP1 = this.lastTailPositionCP1 || new Phaser.Point();
        this.lastTailPositionCP2 = this.lastTailPositionCP2 || new Phaser.Point();
        this.lastTailTime = this.lastTailTime || this.game.time.now;
        var distance = Math.abs(this.lastTailPosition.distance(this.position));

        if (this.game.time.now - this.lastTailTime < cp1CaptureInterval)
        {
            this.lastTailPositionCP1.copyFrom(this.position);
        }

        if (this.game.time.now - this.lastTailTime < cp2CaptureInterval)
        {
            this.lastTailPositionCP2.copyFrom(this.position);
        }

        if (this.game.time.now - this.lastTailTime >= drawInterval)
        {
            bmd.clear();
            bmd.context.moveTo((this.lastTailPosition.x), (this.lastTailPosition.y));
//            bmd.context.lineTo(Math.round(this.x), Math.round(this.y));
            var cp2add = new Phaser.Point(10, 10).rotate(0, 0, this.rotationPerp).negative();
            var cp2 = this.position.clone().add(cp2add.x, cp2add.y);
//            bmd.context.bezierCurveTo(this.lastTailPositionCP1.x, this.lastTailPositionCP1.y, cp2.x, cp2.y, this.x, this.y);
            bmd.context.bezierCurveTo(this.lastTailPositionCP1.x, this.lastTailPositionCP1.y, this.lastTailPositionCP2.x, this.lastTailPositionCP2.y, this.x, this.y);
            bmd.context.stroke();
            bmd.dirty = true;
            this.lastTailPosition.copyFrom(this.position);
            this.lastTailTime = this.game.time.now;
        }
    }

});