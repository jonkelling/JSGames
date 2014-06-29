
define(['AsteraxSprite', 'shield', 'loadout'], function(AsteraxSprite, Shield, Loadout) {
	//var ship;
	var killCount = 0;
	
	var module = function(aName)
	{
		AsteraxSprite.call(this, game, 200, 200, 'ship');
		
		this.name = aName ? aName : "A-Ship";
		this.create();
	};
	
	module.prototype = Object.create(AsteraxSprite.prototype);
	module.prototype.constructor = module;
	
	module.prototype.create = function()
	{
		this.loadConfig(1);
		
		this.body.data.immuneToRocks = [];
		
		this.frame = 0;
		this.body.damping = 0;
		this.body.angularDamping = 0;
		
		this.outOfBoundsKill = false;
		
		this.body.clearShapes();
		this.body.addPhaserPolygon('ship', 'ship_00');
		
		this.body.setCollisionGroup(app.shipCollisionGroup);
		this.body.collides([app.rocksCollisionGroup]);
		this.body.onBeginContact.add(hitRock, this);
		
		this.speed = 0;
		this.loadout.engine.topSpeed = 17;
		this.prevVelocity = new Phaser.Point();
		
		//touchscreen
		this.touchingScreen = false;
		if (game.device.touch)
		{
			game.input.onDown.add(touchInputDown, this);
			game.input.onUp.add(touchInputUp, this);
			
			game.input.touch.touchMoveCallback = function() { };
		}
	};
	
	module.prototype.loadConfig = function(id) {
		this.loadout = Loadout.getShip(id);
		this.health = this.loadout.shield.health;
	}
	
	module.prototype.update = function()
	{
		this.wrap();
		
		var isTurning = 
			app.cursors.left.isDown ||
			app.cursors.right.isDown;
		
		app.cursors.left.isDown  ?	this.body.rotateLeft(70) :
		app.cursors.right.isDown ?	this.body.rotateRight(70) :
									this.body.setZeroRotation();
		
		setShipFrame(this);
		
		
		
		if (app.cursors.up.isDown || this.touchingScreen == true)
		{
			if (this.speed > this.loadout.engine.topSpeed)
			{
				var angleFromVelocity = new Phaser.Point().angle(new Phaser.Point(this.body.velocity.x, this.body.velocity.y).rperp(), true);
				if (Math.abs(this.body.angle - angleFromVelocity) > 2.5)
				{
					thrust.call(this, this.loadout.engine.acceleration);
					var q = this.loadout.engine.topSpeed / Math.sqrt(Math.pow(this.body.velocity.x, 2) + Math.pow(this.body.velocity.y, 2));
					this.body.data.velocity[0] *= q;
					this.body.data.velocity[1] *= q;
				}
				else if (!isTurning)
				{
					var newVelocity = app.velocityFromRotation(this.rotation, this.loadout.engine.topSpeed).perp();
					this.body.data.velocity[0] = newVelocity.x;
					this.body.data.velocity[1] = newVelocity.y;
				}
				// writeDebug([
				// 		this.loadout.engine.topSpeed,
				// 		Math.sqrt(Math.pow(this.body.velocity.x, 2) + Math.pow(this.body.velocity.y, 2)),
				// 		q+"",
				// 		"angle:  " + this.body.angle,
				// 		"angle2: " + new Phaser.Point().angle(new Phaser.Point(this.body.velocity.x, this.body.velocity.y).rperp(), true),
				// 	]);
			}
			else
			{
				thrust.call(this, this.loadout.engine.acceleration);
			}
		}
		
		//writeDebug(
		//		[
		//			"speed:           " + Math.round(this.body.speed),
		//			"velocity:        " + roundPoint(this.body.velocity),
		//			"max velocity:    " + roundPoint(this.body.maxVelocity),
		//			"correct max vel: " + roundPoint(v2),
		//			"drag:            " + roundPoint(this.body.drag),
		//			"new velocity:    " + roundPoint(this.body.newVelocity),
		//		]);
	};
	
	return module;
	
	function thrust(acceleration)
	{
		if (!(this.prevVelocity.equals(this.body.velocity)))
			this.speed = new Phaser.Point().distance(this.body.velocity);
		
		// writeDebug2([
		// 	["prev vel: " + [Math.round(this.prevVelocity.x, 2), Math.round(this.prevVelocity.y, 2)]],
		// 	["velocity: " + [Math.round(this.body.velocity.x, 2), Math.round(this.body.velocity.y, 2)]],
		// 	["speed:    " + this.speed]
		// ]);
		
		//if (this.loadout.engine.topSpeed > this.speed)
		{
			this.body.thrust(acceleration);
		}
	}

	function setShipFrame(ship) {
		var angle = ship.angle < 0 ? ship.angle + 360 : ship.angle;
		while (angle >= 360)
			angle -= 360;
	
		var nextFrame = Math.round(angle / 6);
		if (nextFrame >= 60)
			nextFrame = 0;

		if (ship.frame != nextFrame) {
			ship.frame = nextFrame;
			ship.body.clearShapes();
			ship.body.addPhaserPolygon('ship', 'ship_' + (ship.frame).toString().padZero(2));
			ship.body.setCollisionGroup(app.shipCollisionGroup);
		}
	}
	
	function hitRock(rock) {
		if (rock.sprite.canHitShip)
		{
			rock.sprite.canHitShip = false;
			// r.sprite.kill();
			killCount++;
			
			this.damage(1);
			
			game.time.events.add(Phaser.Timer.HALF, resetRockHit, this, rock.sprite);
		}
	}
	
	function resetRockHit(rock)
	{
		rock.canHitShip = true;
	}
		
	function touchInputDown()
	{
		if (game.input.x > game.width / 2)
		{
			this.touchingScreen = true;
		}
	}
	
	function touchInputUp()
	{
		this.touchingScreen = false;
	}
	
});
