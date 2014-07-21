
define(['weapon'], function(Weapon) {
	
	var showDebugLines = false;
	var greenLineColor = "rgba(0,255,0,0.1)";
	var triModMax = 12;
	var homingThrustCut = 1;
	
	var module = function(spriteKey, tailSpriteKey)
	{
		Weapon.call(this, "homingShot", spriteKey, tailSpriteKey);
		
		this.timer = game.time.create(false);
		this.timer.loop(150, updateTargetRocks, this);
		this.timer.start();

		this.destroyables.push(this.timer);
	};
	
	module.prototype = Object.create(Weapon.prototype);
	module.prototype.constructor = module;
	
	module.prototype.setupNextBullet = function(bullet)
	{
		var savedSpeed = this.speed;
		// this.speed = this.speed * 0.8;
		Weapon.prototype.setupNextBullet.apply(this, arguments);
		this.speed = savedSpeed;
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
		Weapon.prototype.update.apply(this);
		
		if (this.group.countLiving() == 0)
		{
			game.debug.geom();
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

//        wobbleBullet.call(bullet);

		if (bullet.closestRock)
		{
			bullet.targetLine = bullet.targetLine || new Phaser.Line(0,0,100,100);
			bullet.targetLine.fromSprite(bullet, bullet.closestRock, true);
			
			if (showDebugLines)
				game.debug.geom(bullet.targetLine, "rgba(0,255,0,0.1)");
			
			var line = bullet.targetLine;
			
			var targetAngle = bullet.position.angle(bullet.closestRock.position)
			var bulletRotation = bullet.body.rotation;// bullet.previousPosition.angle(bullet.position);
			
			// Gradually (bullet.TURN_RATE) aim the missile towards the target angle
			if (bulletRotation !== targetAngle) {
				// Calculate difference between the current angle and targetAngle
				var delta = targetAngle - bulletRotation;
				
				// Keep it in range from -180 to 180 to make the most efficient turns.
				while (delta > Math.PI) delta -= game.math.PI2;
				while (delta < -Math.PI) delta += game.math.PI2;
				
				// app.debug.writeDebug3("speed: " + bullet.speed + "<br/>delta: " + delta.toFixed(4) + "<br/>" + "targetAngle: " + targetAngle.toFixed(4) + "<br/>" + "bulletRotation: " + bullet.body.rotation.toFixed(4));
				
				/*if (delta > 0) {
					// Turn clockwise
					bullet.body.rotation += Math.min(this.config.turnRate, delta);
					// app.debug.writeDebug4("right");
				} else {
					// Turn counter-clockwise
					bullet.body.rotation += Math.max(-this.config.turnRate, delta);
					// app.debug.writeDebug4("left");
				}*/
				
				// app.debug.writeDebug4("speed: " + bullet.speed + "<br/>delta: " + delta.toFixed(4) + "<br/>" + "targetAngle: " + targetAngle.toFixed(4) + "<br/>" + "bulletRotation: " + bullet.body.rotation.toFixed(4));
				
				// Just set angle to target angle if they are close
				// if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
				// 	this.rotation = targetAngle;
				// }
			}
			
			// bullet.body.rotation = bullet.angleTo(bullet.closestRock);
			
			// app.debug.writeDebug3(bullet.speed + ", " + bullet.weapon.pxm);
			if (bullet.speed > bullet.weapon.pxm)
			{
				// app.debug.writeDebug5("back");
				// bullet.thrust(50, (bullet.body.rotation)+Math.PI);
			}
			else
			{
				// app.debug.writeDebug5("forward");
				// bullet.thrust(200, bullet.body.rotation);
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
				drawVelocityPolygon(bullet);
		}
	};
	
	module.prototype.deadBulletUpdate = function(bullet)
	{
	};
	
	return module;
	
	function updateTargetRocks()
	{
		this.group.forEachAlive(updateTargetRock);
	}
	
	function updateTargetRock(bullet)
	{
        if (bullet.closestRock)
            bullet.closestRock.targetingBullet = null;
        bullet.closestRock = null;

		var rocks = app.rockGroupController.rocks;
		var closestRock = rocks.getFirstAlive();
		
		if (closestRock)
		{

			var closestDistance = 9999999;
			
			rocks.forEachAlive(function(rock) {
				var rockDistance = rock.position.distance(bullet.position);
                if (!rock.targetingBullet || !rock.targetingBullet.alive || rock.targetingBullet === bullet)
				if (rockDistance < closestDistance || rock.targetingBullet === bullet)
				{
					closestRock = rock;
					closestDistance = rockDistance;
				}
			});
			
			bullet.closestRock = closestRock;
			bullet.closestRock.targetingBullet = bullet;
		}
	}
	
	function getThrustDirectionUsingCentroid()
	{
		// var v = this.rawVelocity.clone();
		// v.setMagnitude(v.getMagnitude()*1);
		
		// app.debug.writeDebug2([this.speed]);
		// app.debug.writeDebug3(this.rawVelocityNegative.rotation);
		// app.debug.writeDebug4(this.angleTo(this.closestRock));
		// app.debug.writeDebug5(this.rawVelocityNegative + "<br/>" + this.position + "<br/>" + this.closestRock.position);
		
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
		
		// because closestRock changes, of course.
		points[1] = this.closestRock.position;
		
		return Phaser.Point.centroid(points);
	}
	
	function drawVelocityPolygon(bullet)
	{
		var centroid = getThrustDirectionUsingCentroid.call(bullet);
		var points = bullet.velocityPolygonPoints;
		
		game.debug.geom(points[0].lineTo(points[1]), greenLineColor);
		game.debug.geom(points[1].lineTo(points[2]), greenLineColor);
		game.debug.geom(points[2].lineTo(points[0]), greenLineColor);
				
		game.debug.geom(centroid, "rgba(255,0,0,0.4)");
		
		// getSlowDownTargetPoint(bullet);
	}
	
	function getSlowDownTargetPoint(bullet)
	{
		// var v = bullet.rawVelocity.clone();
		// v.setMagnitude(v.getMagnitude()*1);
		
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
        var wobbleSpeed = 10;
        this.wobbleStartTime = this.wobbleStartTime || game.time.now;
        var rotationDelta = this.body.rotation - (this.lastRotation || this.body.rotation);
        this.lastRotation = this.body.rotation;
        this.wobbleVelocity = this.wobbleVelocity || new Phaser.Point();
        var wobbleDistance = wobbleSpeed * Math.sin((game.time.now - app.startTime)/50);

        this.wobbleVelocity.rotate(0, 0, this.lastRotation, false, wobbleDistance);

    }

    function moveForwardWithRotation(speed, rotation)
    {
        var savedRotation = this.body.rotation;
        this.body.rotation = rotation;
        this.body.setMagnitude(speed);
        this.body.rotation = savedRotation;
    }

});