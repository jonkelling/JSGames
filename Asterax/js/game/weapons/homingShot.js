
define(['weapon'], function(Weapon) {
	
	var showDebugLines = true;
	var greenLineColor = "rgba(0,255,0,0.1)";
	var triModMax = 12;
	var homingThrustCut = 1;
    var wobbleSpeed = 90;
    var wobbleInterval = Phaser.Timer.SECOND / 5;
    var wobbleDirection;
    var wobbleAngle = 110;
    var wobbleCutbackDistance = 200;
    var wobbleOn = false;


    var spiralRadius = 8;
    var spiralSpeed = 40;
	
	var module = function(parent, spriteKey, tailSpriteKey)
	{
		Weapon.call(this, parent, "homingShot", spriteKey, tailSpriteKey);

        wobbleDirection = game.math.degToRad(wobbleAngle);
		
		this.timer = game.time.create(false);
		this.timer.loop(150, updateTargetRocks, this);
		this.timer.start();

		this.destroyables.push(this.timer);
	};
	
	module.prototype = Object.create(Weapon.prototype);
	module.prototype.constructor = module;

    module.prototype.destroy = function ()
    {
        this.group.forEach(function(bullet) {
            if (bullet.closestRock)
                if (bullet.closestRock.targetingBullets)
                    bullet.closestRock.targetingBullets.reset();
            bullet.closestRock.targetingBullets =null;
            bullet.closestRock = null;
        });
        Weapon.prototype.destroy.call(this);
    };
	
	module.prototype.setupNextBullet = function(bullet)
	{
		var savedSpeed = this.speed;
//		this.speed = this.speed * 2.8;
		Weapon.prototype.setupNextBullet.apply(this, arguments);
		this.speed = savedSpeed;
	};

    module.prototype.bulletKilled = function (bullet)
    {
        if (bullet.closestRock)
        {
            getTargetingBullets(bullet.closestRock).remove(bullet);
        }
        bullet.closestRock = null;
    };

	module.prototype.afterFire = function(bullet)
	{
		updateTargetRock(bullet);
		bullet.startTime = game.physics.p2.time;
		bullet.lastTime = bullet.startTime;
		bullet.startPosition = bullet.position.clone();
		bullet.positionHistory = "";
		bullet.positionHistory += bullet.position.clone().subtract(bullet.startPosition.x, bullet.startPosition.y).toStringFixed() + "<br/>\n";
	};
	
	module.prototype.update = function()
	{
        if (!game.physics.p2.paused)
        {
            Weapon.prototype.update.apply(this);

            if (this.group.countLiving() == 0)
            {
                game.debug.stop();
            }
        }
	};
	
	module.prototype.aliveBulletUpdate = function(bullet)
	{
        if (game.physics.p2.time - bullet.lastTime >= 0.1)
		{
			bullet.lastTime = game.physics.p2.time;
			bullet.positionHistory += game.physics.p2.time + ": " + bullet.position.clone().subtract(bullet.startPosition.x, bullet.startPosition.y).toStringFixed() + "<br/>\n";
			// app.debug.writeDebug4(bullet.positionHistory);
		}

        if (wobbleOn) {
            wobbleBullet.call(bullet);
        }

		if (bullet.closestRock)
		{
			bullet.targetLine = bullet.targetLine || new Phaser.Line(0,0,100,100);
			bullet.targetLine.fromSprite(bullet, bullet.closestRock, true);
			
			if (showDebugLines)
				game.debug.geom(bullet.targetLine, "rgba(0,255,0,0.1)");
			
			var targetAngle = bullet.position.angle(bullet.closestRock.position);
			var bulletRotation = bullet.body.rotation;// bullet.previousPosition.angle(bullet.position);
			
			// Gradually (bullet.TURN_RATE) aim the missile towards the target angle
			if (bulletRotation !== targetAngle) {
				// Calculate difference between the current angle and targetAngle
				var delta = targetAngle - bulletRotation;
				
				// Keep it in range from -180 to 180 to make the most efficient turns.
				while (delta > Math.PI) delta -= game.math.PI2;
				while (delta < -Math.PI) delta += game.math.PI2;
			}
			
			var thrustTarget = getThrustDirectionUsingCentroid.call(bullet);
			
			var absBulletRockDelta = Math.abs(bullet.angleTo(bullet.closestRock) - bullet.rawVelocityNegative.rotation);
			
			// app.debug.writeDebug3(absBulletRockDelta);
			// app.debug.writeDebug4(bullet.speed.toFixed(2) + " / " + bullet.weapon.pxm.toFixed(2));
			
			// if (absBulletRockDelta > 0.15)
			{
				if (bullet.speed > bullet.weapon.pxm)
					bullet.thrust(bullet.weapon.pxm*2/homingThrustCut, bullet.angleTo(getSlowDownTargetPoint(bullet)));
				else
					bullet.thrust(bullet.weapon.pxm*2/homingThrustCut, bullet.angleTo(thrustTarget));
			}

            bullet.body.rotation = bullet.rawVelocity.rotation90;
			
			if (showDebugLines)
            {
                drawVelocityPolygon(bullet);
            }
		}

        var age = game.physics.p2.time - bullet.startTime;
        var mod = age / (bullet.weapon.lifespan / 1000);
//        mod /= 2;
//        mod += 0.5;
        mod = 1 - mod;

//        bullet.blueTint = Math.round(0xff * mod);
//        bullet.greenTint = Math.round(0xff * mod);
	};
	
	module.prototype.deadBulletUpdate = function(bullet)
	{
	};
	
	return module;
	
	function updateTargetRocks()
	{
        if (!game.physics.p2.paused)
		    this.group.forEachAlive(updateTargetRock);
	}
	
	function updateTargetRock(bullet)
	{
        if (bullet.closestRock)
            getTargetingBullets(bullet.closestRock).remove(bullet);
        bullet.closestRock = null;

		var rocks = app.rockGroupController.rocks;
		var closestRock = rocks.getFirstAlive();
		
		if (closestRock)
		{
			var closestDistance = Number.MAX_VALUE;
			
			rocks.forEachAlive(function(rock) {
				var rockDistance = rock.position.distance(bullet.position);

				if (rockDistance < closestDistance && getBulletCanTargetRock(bullet, rock))
				{
					closestRock = rock;
					closestDistance = rockDistance;
				}
			});

			bullet.closestRock = closestRock;
            getTargetingBullets(bullet.closestRock).add(bullet);
		}
	}
	
	function getThrustDirectionUsingCentroid()
	{
		var triMod = getTriMod.call(this);
		
		var v = this.rawVelocity;
		var point3 = this.point3 = (this.point3 || this.position.clone());
		point3.copyFrom(this.position);
		point3.add(v.x * triMod, v.y * triMod);
		var points = this.velocityPolygonPoints = (this.velocityPolygonPoints || [
			this.position,
			this.closestRock.position,
			point3
		]);
		
		// element #1 of the array needs to be set
		// because this.closestRock could have changed
        // since the array was created.
		points[1] = this.closestRock.position;
		
		return Phaser.Point.centroid(points);
	}
	
	function drawVelocityPolygon(bullet)
	{
		var centroid = getThrustDirectionUsingCentroid.call(bullet);
		var points = bullet.velocityPolygonPoints;
		
		game.debug.geom(points[2].lineTo(points[0]), greenLineColor);
		game.debug.geom(points[0].lineTo(points[1]), greenLineColor);
		game.debug.geom(points[1].lineTo(points[2]), greenLineColor);

		game.debug.geom(centroid, "rgba(255,0,0,0.4)");
		
		// getSlowDownTargetPoint(bullet);
	}
	
	function getSlowDownTargetPoint(bullet)
	{
		var triMod = getTriMod.call(bullet);
		
		var v = bullet.rawVelocity;
		var point3 = bullet.point3 = (bullet.point3 || bullet.position.clone());
		point3.copyFrom(bullet.position);
		point3.add(v.x * triMod, v.y * triMod);
		
		var a = point3.angle(bullet.position) - point3.angle(bullet.closestRock.position);
		var d = Math.cos(a)*point3.distance(bullet.position);


		var line = point3.lineTo(bullet.closestRock.position);
		
		var point4 = Phaser.Point.interpolate(line.start, line.end, d/line.length);
		line.start.setTo(bullet.position.x, bullet.position.y);
		line.end.setTo(point4.x, point4.y);
		
		if (showDebugLines)
			game.debug.geom(line, greenLineColor);
		
		return point4;
	}
	
	function getTriMod()
	{
		var delta = this.rawVelocityNegative.rotation - this.angleTo(this.closestRock);
		
		while (delta > Math.PI) delta -= game.math.PI2;
		while (delta < -Math.PI) delta += game.math.PI2;
		
		delta = Math.abs(delta);
		
		return Math.min(triModMax, Math.pow(5*delta, 2.4) + 1);
	}

    function wobbleBullet()
    {
        this.wobbleStartTime = this.wobbleStartTime || game.time.now;
        this.wobbleDirection = this.wobbleDirection || wobbleDirection;

//        app.debug.writeDebug([game.time.now, this.wobbleStartTime, wobbleInterval]);

        if ((game.time.now - this.wobbleStartTime) > wobbleInterval)
        {
//            this.body.rotation = this.rawVelocity.rotation90 + this.wobbleDirection;
//            app.debug.writeDebug3(this.rawVelocity.rotation90 + "<br>" + this.body.rotation);
            this.wobbleDirection *= -1;
            this.wobbleStartTime = game.time.now;
        }

        var wobbleSpeedActual = wobbleSpeed;
        var wobbleDirectionActual = this.wobbleDirection;

        if (this.distanceToTarget < wobbleCutbackDistance)
        {
            wobbleSpeedActual *= Phaser.Easing.Quadratic.In(this.distanceToTarget / wobbleCutbackDistance);
            wobbleDirectionActual *= this.distanceToTarget / wobbleCutbackDistance;
        }

        this.thrust(wobbleSpeedActual, this.rotationPerp + wobbleDirectionActual);

//        var rotationDelta = this.body.rotation - (this.lastRotation || this.body.rotation);
//        this.lastRotation = this.body.rotation;
//        this.wobbleVelocity = this.wobbleVelocity || new Phaser.Point();
//        var wobbleDistance = wobbleSpeed * Math.sin((game.time.now - app.startTime)/50);
//
//        this.wobbleVelocity.rotate(0, 0, this.lastRotation, false, wobbleDistance);
    }

    function moveForwardWithRotation(speed, rotation)
    {
        var savedRotation = this.body.rotation;
        this.body.rotation = rotation;
        this.body.setMagnitude(speed);
        this.body.rotation = savedRotation;
    }

    function getTargetingBullets(rock)
    {
        if (!rock.targetingBullets)
        {
            rock.targetingBullets = new Phaser.ArrayList();
        }
        return rock.targetingBullets;
    }

    function getTargetingBulletsMax(rock)
    {
        return rock.rockSize === app.rockSize.SMALL ? 1 :
               rock.rockSize === app.rockSize.MEDIUM ? 3 :
               rock.rockSize === app.rockSize.LARGE ? 6 :
               1;
    }

    function getBulletCanTargetRock(bullet, rock)
    {
        var targetingBullets = getTargetingBullets(rock);
        var targetingBulletsMax = getTargetingBulletsMax(rock);

        if (targetingBullets.exists(bullet))
        {
            return true;
        }
        return targetingBullets.total < targetingBulletsMax;
    }

});
