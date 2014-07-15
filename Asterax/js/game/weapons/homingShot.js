
define(['weapon'], function(Weapon) {
	
	var module = function()
	{
		Weapon.call(this, "homingShot");
		
		this.timer = game.time.create(false);
		this.timer.loop(50, updateTargetRocks, this);
		this.timer.start();
		
		this.destroyables.push(this.timer);
	};
	
	module.prototype = Object.create(Weapon.prototype);
	module.prototype.constructor = module;
	
	module.prototype.setupNextBullet = function(bullet)
	{
		Weapon.prototype.setupNextBullet.apply(this, arguments);
		// bullet.body.damping = 0.99999999;
		bullet.body.angularDamping = 0.5;
		bullet.startingSpeed = Math.round(bullet.speed);
	}
	
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
		
		var s = "";
		this.group.forEachAlive(function(bullet) {
			s += bullet.startingSpeed + " / " + Math.round(bullet.speed) + "<br/>";
		}, this);
		
		// app.debug.writeDebug3(s);
		
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
		
		if (bullet.closestRock)
		{
			bullet.targetLine = bullet.targetLine || new Phaser.Line(0,0,100,100);
			bullet.targetLine.fromSprite(bullet, bullet.closestRock, true);
			// game.debug.geom(bullet.targetLine);
			
			var line = bullet.targetLine;
			
			drawThrustDirectionLine(bullet);
			
			bullet.body.thrust(this.speed/20);
			
			var targetAngle = bullet.position.angle(bullet.closestRock.position)
			var bulletRotation = bullet.body.rotation;// bullet.previousPosition.angle(bullet.position);
			
			// Gradually (bullet.TURN_RATE) aim the missile towards the target angle
			if (bulletRotation !== targetAngle) {
				// Calculate difference between the current angle and targetAngle
				var delta = targetAngle - bulletRotation;
				
				// Keep it in range from -180 to 180 to make the most efficient turns.
				while (delta > Math.PI) delta -= game.math.PI2;
				while (delta < -Math.PI) delta += game.math.PI2;
				
				app.debug.writeDebug3("delta: " + delta.toFixed(4) + "<br/>" + "targetAngle: " + targetAngle.toFixed(4) + "<br/>" + "bulletRotation: " + bullet.body.rotation.toFixed(4));
				
				if (delta > 0) {
					// Turn clockwise
					bullet.body.rotation += Math.min(this.config.turnRate, delta);
					app.debug.writeDebug4("right");
				} else {
					// Turn counter-clockwise
					bullet.body.rotation += Math.max(-this.config.turnRate, delta);
					app.debug.writeDebug4("left");
				}
				
				app.debug.writeDebug4("delta: " + delta.toFixed(4) + "<br/>" + "targetAngle: " + targetAngle.toFixed(4) + "<br/>" + "bulletRotation: " + bullet.body.rotation.toFixed(4));
				
				// Just set angle to target angle if they are close
				// if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
				// 	this.rotation = targetAngle;
				// }
			}
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
		var rocks = app.rockGroupController.rocks;
		var closestRock = rocks.getFirstAlive();
		
		if (closestRock)
		{
			var closestDistance = closestRock.position.distance(bullet.position);
			
			rocks.forEachAlive(function(rock) {
				var rockDistance = rock.position.distance(bullet.position);
				if (rockDistance < closestDistance)
				{
					closestRock = rock;
					closestDistance = rockDistance;
				}
			});
			
			bullet.closestRock = closestRock;
		}
	}
	
	function drawThrustDirectionLine(bullet) {
		var line = bullet.thrustDirectionLine = bullet.thrustDirectionLine || new Phaser.Line();
		
		line.start.setTo(bullet.center.x, bullet.center.y);
		line.end.setTo(bullet.center.x, bullet.center.y);
		
		var shift = new Phaser.Point(20, 0);
		shift.rotate(0, 0, bullet.rotation + app.PIOver2);
		line.end.add(shift.x, shift.y);
		
		game.debug.geom(line);
	}

});