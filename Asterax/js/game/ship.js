
define(function() {
	//var ship;
	
	var module = function(aName) {
		this.name = aName ? aName : "A-Ship";
		this.ship = null;
	}
	
	module.prototype = {
		constructor: module,
				
		create: function()
		{
			var ship = this.ship = game.add.sprite(100, 100, 'ship');
			game.physics.p2.enable(ship, app.showPolygons);
			
			ship.frame = 0;
			ship.body.damping = 0;
			ship.body.angularDamping = 0;
			
			ship.body.clearShapes();
			ship.body.addPhaserPolygon('ship', 'ship_00');
			
			ship.body.setCollisionGroup(app.shipCollisionGroup);
			ship.body.collides(app.rocksCollisionGroup, hitRock, this);
			
			this.body = ship.body;
		},
		
		update: function()
		{
			var ship = this.ship;
			
			game.world.wrap(ship.body, Math.round(Math.max(ship.width, ship.height) / 2), false);
			
			cursors.left.isDown  ?	ship.body.rotateLeft(70) :
			cursors.right.isDown ?	ship.body.rotateRight(70) :
									ship.body.setZeroRotation();
			
			
			if (!cursors.up.isDown)
			{
				// ??
			}
			else
			{
				ship.body.thrust(acceleration);
			}
			
			if (false && ship.body.speed > maxSpeed) {
				
				// var q = maxSpeed / Math.sqrt(Math.pow(ship.body.velocity.x, 2) + Math.pow(ship.body.velocity.y, 2));
				//writeDebug2([
				//		maxSpeed,
				//		Math.sqrt(Math.pow(ship.body.velocity.x, 2) + Math.pow(ship.body.velocity.y, 2)),
				//		q+""
				//	]);
				// ship.body.velocity.x *= q;
				// ship.body.velocity.y *= q;
			}
			
			//writeDebug(
			//		[
			//			"speed:           " + Math.round(ship.body.speed),
			//			"velocity:        " + roundPoint(ship.body.velocity),
			//			"max velocity:    " + roundPoint(ship.body.maxVelocity),
			//			"correct max vel: " + roundPoint(v2),
			//			"drag:            " + roundPoint(ship.body.drag),
			//			"new velocity:    " + roundPoint(ship.body.newVelocity),
			//		]);
			
			setShipFrame(ship);
		}
	};
	
	return module;

	function setShipFrame(ship) {
		//var ship = this.ship;
		
		var angle = ship.angle < 0 ? ship.angle + 360 : ship.angle;
		while (angle >= 360)
			angle -= 360;
	
		var nextFrame = Math.round(angle / 6);
		if (nextFrame >= 60)
			nextFrame = 0;

		if (ship.frame != nextFrame) {
			ship.frame = nextFrame;
			ship.body.clearShapes();
			ship.body.addPhaserPolygon('ship', 'ship_' + ship.frame.toString().padZero(2));
			ship.body.setCollisionGroup(app.shipCollisionGroup);
		}
	}
	
	function hitRock(s, r) {
		r.sprite.kill();
	}
});
