
define(function() {
	//var ship;
	
	var module = function(aName) {
		this.name = aName ? aName : "A-Ship";
		this.ship = null;
	}
	
	function setShipFrame(ship) {
		//var ship = this.ship;
		
		var angle = ship.angle < 0 ? ship.angle + 360 : ship.angle;
		while (angle >= 360)
			angle -= 360;
	
		var nextFrame = Math.round(angle / 6);
		if (nextFrame >= 60)
			nextFrame = 0;
	
		ship.frame = nextFrame;
	}
	
	module.prototype = {
		constructor: module,
				
		create: function()
		{
			var ship = this.ship = game.add.sprite(100, 100, 'ship');
			ship.frame = 0;
			ship.anchor.set(0.5);
			
			//game.physics.enable(ship, Phaser.Physics.ARCADE);
			//game.physics.enable(ship, Phaser.Physics.NINJA);
			//game.physics.ninja.enableCircle(ship, ship.width * 0.9);
			//game.physics.ninja.enableTile(ship, 30);
			game.physics.p2.enable(ship);
			
			//ship.body.maxVelocity.set(300);
			//ship.body.maxSpeed = 300;
			
			this.body = ship.body;
		},
		
		update: function()
		{
			var ship = this.ship;
			//ship.body.angularDrag = 5000;
			
			if (cursors.left.isDown)
			{
				ship.angle -= 4;
				//ship.body.angularDrag = 0;
				//ship.body.angularVelocity = -turnSpeed;
			}
			else if (cursors.right.isDown)
			{
				ship.angle += 4;
				//ship.body.angularDrag = 0;
				//ship.body.angularVelocity = turnSpeed;
			}
			
			//var v2 = game.physics.arcade.velocityFromAngle(ship.angle-90, maxSpeed);
			if (!cursors.up.isDown)
			{
				//ship.body.acceleration.set(0);
				
				//ship.body.moveTo(ship.body.speed, ship.angle-90);
			}
			else
			{
				//var v2 = game.physics.arcade.velocityFromRotation(ship.rotation-(3.14159/2), acceleration);
				//var v2 = game.physics.arcade.velocityFromAngle(ship.angle-90, acceleration);
				//ship.body.velocity = v2;
				//ship.body.moveTo(ship.body.speed + 100, ship.angle-90);
				//game.physics.arcade.accelerationFromRotation(ship.rotation-(3.14159/2), acceleration, ship.body.acceleration);
			}
			
			alert(ship.body.speed);
			if (ship.body.speed > maxSpeed) {
				
				// var q = maxSpeed / Math.sqrt(Math.pow(ship.body.velocity.x, 2) + Math.pow(ship.body.velocity.y, 2));
				//writeDebug2([
				//		maxSpeed,
				//		Math.sqrt(Math.pow(ship.body.velocity.x, 2) + Math.pow(ship.body.velocity.y, 2)),
				//		q+""
				//	]);
				// ship.body.velocity.x *= q;
				// ship.body.velocity.y *= q;
			}
			
			//ship.body.maxVelocity = new Phaser.Point(100, 100);
			
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
			
			screenWrap(ship);
		}
	};
	
	return module;
});
