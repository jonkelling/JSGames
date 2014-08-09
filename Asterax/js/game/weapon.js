
define(['destroyable', 'AsteraxSprite', 'loadout', 'bullet', 'TailEmitter', 'TailEmitterParticle'], function(Destroyable, AsteraxSprite, Loadout, Bullet, TailEmitter, TailEmitterParticle) {

    var tailEmitterLifespan = 350;
    var tailEmitterEase = Phaser.Easing.Quadratic.In;

    var tailPointLifespan = 2000;
    var drawInterval = 50;
    var cp1CaptureInterval = drawInterval / 3;
    var cp2CaptureInterval = drawInterval - cp1CaptureInterval;

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
        if (this.tailBitmapData)
        {
            this.tailBitmapData.clear();
        }
		this.group.forEach(_bulletUpdate, this);
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
		if (bullet.alive)
            this.aliveBulletUpdate(bullet);
		else if (bullet.exists)
            this.deadBulletUpdate(bullet);

        if (this.config.drawTail === true)
        {
            drawTail.call(bullet);
        }
	}
	
	function _bulletKilled(bullet)
	{
		this.bulletKilled(bullet);
//        bullet.tailPoints = null;
//        bullet.lastTailTime = null;
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

    function BezierPoint(p, timeAdded)
    {
        this.point = p.clone();
        this.controlPoint = null;
        this.controlPoint2 = null;
        this.endPoint = false;
        this.timeAdded = timeAdded;
        this.sprite = null;
    }

    function trackTail()
    {
        this.trackTailWrapped = this.trackTailWrapped || this.events.onWrapped.add(function(lastPosition)
        {
            if (this.tailPoints)
            {
                if (this.tailPoints.last)
                {
                    this.tailPoints.last.controlPoint = this.tailPoints.last.controlPoint || this.tailPoints.last.point;
                    this.tailPoints.last.controlPoint2 = this.tailPoints.last.controlPoint2 || lastPosition.clone();

                    if (this.tailPoints.last.sprite)
                    {
                        this.tailPoints.last.sprite.kill();
                        this.tailPoints.last.sprite = null;
                    }
                }

                var bz1 = this.tailPoints.add(new BezierPoint(lastPosition, this.game.time.now));
                bz1.endPoint = true;

                var bz2 = this.tailPoints.add(new BezierPoint(this.position, this.game.time.now));
                bz2.controlPoint = bz2.point;
                bz2.controlPoint2 = bz2.point;
            }
        }, this);

        this.tailPoints = this.tailPoints || new Phaser.LinkedList();
        this.lastTailTime = (this.tailPoints.last && this.tailPoints.last.timeAdded) ? this.tailPoints.last.timeAdded : this.game.time.now;

        var deltaTime = this.game.time.now - this.lastTailTime;

        if (this.tailPoints.last == null)
        {
            this.tailPoints.add(new BezierPoint(this.position.clone(), this.game.time.now));
        }
        else
        {
            if (this.tailPoints.last.sprite)
            {
                this.tailPoints.last.sprite.kill();
                this.tailPoints.last.sprite = null;
            }
            if (this.tailPoints.last.controlPoint == null)
            {
                if (deltaTime >= cp1CaptureInterval)
                {
                    this.tailPoints.last.controlPoint = this.position.clone();
                }
            }
            else if (this.tailPoints.last.controlPoint2 == null)
            {
                if (deltaTime >= cp2CaptureInterval)
                {
                    this.tailPoints.last.controlPoint2 = this.position.clone();
                }
            }
            else
            {
                if (deltaTime >= drawInterval)
                {
                    this.tailPoints.add(new BezierPoint(this.position, this.game.time.now));
                    this.lastTailTime = this.game.time.now;
                }
            }
        }
    }

    function expireTail()
    {
        while (this.tailPoints.first && (this.game.time.now - this.tailPoints.first.timeAdded) > tailPointLifespan)
        {
            if (this.tailPoints.first.sprite)
            {
                this.tailPoints.first.sprite.kill();
                this.tailPoints.first.sprite = null;
            }
            this.tailPoints.remove(this.tailPoints.first);
        }
    }

    function drawTail()
    {
        if (this.exists)
        {
            trackTail.call(this);
        }
        else if (!this.tailPoints)
        {
            return;
        }

        expireTail.call(this);

        this.weapon.newTailBitmapData = this.weapon.newTailBitmapData || function()
        {
            var sprite = this.weapon.tailBitmapSpriteGroup.getFirstExists(false);

            if (sprite && !sprite.exists && !sprite.alive)
            {
                sprite.key.clear();
            }
            else {
                for (var i = 0; i < 1; i++)
                {
                    var bmd = this.game.add.bitmapData(60, 60);//this.game.width, this.game.height);
//                    bmd.context.strokeStyle = Phaser.Color.createColor(255, 255, 255, 0.9).rgba;
//                    bmd.context.lineWidth = 1;
//                    bmd.context.strokeThickness = 1;
                    sprite = this.weapon.tailBitmapSpriteGroup.create(0, 0, bmd, null, false);
                    sprite.smoothed = !app.renderForOldDevice;
                    sprite.bmd = bmd;
                }
            }
            var ret = {sprite:sprite,bmd:sprite.bmd};
            return ret;
        };

        if (!this.weapon.tailBitmapSpriteGroup)
        {
            this.weapon.tailBitmapSpriteGroup = this.game.add.group();
            this.weapon.tailBitmapSpriteGroup.enableBody = false;
        }

//        var bmd = this.weapon.tailBitmapData;
//        if (!this.weapon.tailBitmapData)
//        {
//            bmd = app.bmd = this.weapon.tailBitmapData = this.weapon.tailBitmapData || this.game.add.bitmapData(this.game.width, this.game.height);
//            bmd.context.strokeStyle = Phaser.Color.createColor(255, 255, 255, 0.9).rgba;
//            bmd.context.lineWidth = 1;
//            bmd.context.strokeThickness = 1;
//            this.game.add.sprite(0, 0, bmd);
//        }

        this.tailPoints.callAll2(function(bz) {
            if (bz.sprite && bz.sprite.exists && bz.sprite.alive)
            {
//                bz.sprite.revive();
                return false;
            }
            else
            {
                var x = this.weapon.newTailBitmapData.call(this);
                var bmd = x.bmd;
                bz.sprite = x.sprite;

                if (bz === this.tailPoints.first || bz.prev.endPoint === true)
                {
                }
                else {
                    var tx1 = [Math.round(Math.min(bz.prev.point.x, bz.point.x, bz.prev.controlPoint.x, bz.prev.controlPoint2.x)), Math.round(Math.min(bz.prev.point.y, bz.point.y, bz.prev.controlPoint.y, bz.prev.controlPoint2.y))];
                    var tx1m = [Math.round(Math.max(bz.prev.point.x, bz.point.x, bz.prev.controlPoint.x, bz.prev.controlPoint2.x)), Math.round(Math.max(bz.prev.point.y, bz.point.y, bz.prev.controlPoint.y, bz.prev.controlPoint2.y))];

                    var padding = 2;

//                    bmd.clear();
//                    bmd.refreshBuffer();
//                    bmd.resize(Math.ceil(Math.max(0,1, tx1m[0]-tx1[0])), Math.ceil(Math.max(0,1, tx1m[1]-tx1[1])));
//                    bmd.clear();
                    setupTailBitmapData(bmd);
//                    bz.sprite.width = bmd.width;
//                    bz.sprite.height = bmd.height;
//                    bz.sprite.reset(tx1[0], tx1[1]);
                    bz.sprite.revive();
                    bz.sprite.x = tx1[0] - padding;
                    bz.sprite.y = tx1[1] - padding;
//                    bz.sprite.loadTexture(bmd);
//                    bmd.clear();

//                    this.weapon.counter = this.weapon.counter || 1;
//                    if (this.weapon.counter++ > 100)
//                        return;

                    bmd.context.beginPath();
                    bmd.context.translate(-tx1[0] + padding, -tx1[1] + padding);
                    bmd.context.moveTo(bz.prev.point.x, bz.prev.point.y);
                    bmd.context.bezierCurveTo((bz.prev.controlPoint.x), (bz.prev.controlPoint.y), (bz.prev.controlPoint2.x), (bz.prev.controlPoint2.y), (bz.point.x), (bz.point.y));
                    bmd.context.translate(tx1[0] - padding, tx1[1] - padding);
                    bmd.context.stroke();

                    if (false && bz === this.tailPoints.last && this.exists)
                    {

                        if (!bz.controlPoint) {
                            var tx = [Math.min(bz.point.x, this.x), Math.min(bz.point.y, this.y)];
                            var txm = [Math.max(bz.point.x, this.x), Math.max(bz.point.y, this.y)];
                            bmd.resize(Math.ceil(Math.max(1,txm[0]-tx[0])), Math.ceil(Math.max(1,txm[1]-tx[1])));
                            bz.sprite.reset(tx[0], tx[1]);
                            bz.sprite.loadTexture(bmd);
                            setupTailBitmapData(bmd);
                            bmd.context.beginPath();
                            bmd.context.translate(-tx[0], -tx[1]);
                            bmd.context.moveTo(bz.point.x, bz.point.y);
                            bmd.context.lineTo(this.x, this.y);
                        }
                        else if (!bz.controlPoint2) {
                            var tx = [Math.min(bz.point.x, bz.controlPoint.x, this.x), Math.min(bz.point.y, bz.controlPoint.y, this.y)];
                            var txm = [Math.max(bz.point.x, bz.controlPoint.x, this.x), Math.max(bz.point.y, bz.controlPoint.y, this.y)];
                            bmd.resize(Math.ceil(Math.max(1,txm[0]-tx[0])), Math.ceil(Math.max(1,txm[1]-tx[1])));
                            bz.sprite.reset(tx[0], tx[1]);
                            bz.sprite.loadTexture(bmd);
                            setupTailBitmapData(bmd);
                            bmd.context.beginPath();
                            bmd.context.translate(-tx[0], -tx[1]);
                            bmd.context.moveTo(bz.point.x, bz.point.y);
                            bmd.context.quadraticCurveTo(bz.controlPoint.x, bz.controlPoint.y, this.x, this.y);
                        }
                        else {
                            var tx = [Math.min(bz.point.x, bz.controlPoint.x, bz.controlPoint2.x, this.x), Math.min(bz.point.y, bz.controlPoint.y, bz.controlPoint2.y, this.y)];
                            var txm = [Math.max(bz.point.x, bz.controlPoint.x, bz.controlPoint2.x, this.x), Math.max(bz.point.y, bz.controlPoint.y, bz.controlPoint2.y, this.y)];
                            bmd.resize(Math.ceil(Math.max(1,txm[0]-tx[0])), Math.ceil(Math.max(1,txm[1]-tx[1])));
                            bz.sprite.reset(tx[0], tx[1]);
                            bz.sprite.loadTexture(bmd);
                            setupTailBitmapData(bmd);
                            bmd.context.beginPath();
                            bmd.context.translate(-tx[0], -tx[1]);
                            bmd.context.moveTo(bz.point.x, bz.point.y);
                            bmd.context.bezierCurveTo(bz.controlPoint.x, bz.controlPoint.y, bz.controlPoint2.x, bz.controlPoint2.y, this.x, this.y);
                        }

                        bmd.context.stroke();
                    }

                    bmd.dirty = true;
                }
            }
        }, this);
//        bmd.dirty = true;
    }

    function setupTailBitmapData(bmd)
    {
        bmd.context.strokeStyle = Phaser.Color.createColor(255, 255, 255, 1).rgba;
//        if (bmd.context.lineWidth)
//            bmd.context.lineWidth += 0.1;
//        else
            bmd.context.lineWidth = 1;
//        if (bmd.context.strokeThickness)
//            bmd.context.strokeThickness += 0.1;
//        else
            bmd.context.strokeThickness = 1;
    }
});