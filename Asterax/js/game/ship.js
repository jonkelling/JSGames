
define(['AsteraxSprite'], function(AsteraxSprite) {
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
		this.body.data.immuneToRocks = [];
		
		this.frame = 0;
		this.body.damping = 0;
		this.body.angularDamping = 0;
		
		this.outOfBoundsKill = false;
		
		this.body.clearShapes();
		this.body.addPhaserPolygon('ship', 'ship_00');
		
		this.body.setCollisionGroup(app.shipCollisionGroup);
		this.body.collides([app.rocksCollisionGroup]);
		this.body.onBeginContact.add(hitRock);
	};
	
	module.prototype.update = function()
	{
		this.wrap();
		
		app.cursors.left.isDown  ?	this.body.rotateLeft(70) :
		app.cursors.right.isDown ?	this.body.rotateRight(70) :
									this.body.setZeroRotation();
		
		setShipFrame(this);
		
		if (!app.cursors.up.isDown)
		{
			// ??
		}
		else
		{
			this.body.thrust(acceleration);
		}
		
		if (false && this.body.speed > maxSpeed) {
			
			// var q = maxSpeed / Math.sqrt(Math.pow(this.body.velocity.x, 2) + Math.pow(this.body.velocity.y, 2));
			//writeDebug2([
			//		maxSpeed,
			//		Math.sqrt(Math.pow(this.body.velocity.x, 2) + Math.pow(this.body.velocity.y, 2)),
			//		q+""
			//	]);
			// this.body.velocity.x *= q;
			// this.body.velocity.y *= q;
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
	
	function hitRock(rock, ship) {
		if (rock.sprite.canHitShip)
		{
			rock.sprite.canHitShip = false;
			// r.sprite.kill();
			killCount++;
			
			game.time.events.add(Phaser.Timer.HALF, resetRockHit, this, rock.sprite);
			killCountDebugTimeout = setTimeout(function() { writeDebug(["kills: " + (killCount)]); }, 50);
		}
	}
	
	function resetRockHit(rock)
	{
		rock.canHitShip = true;
	}
	
});
