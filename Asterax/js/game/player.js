define(function () {
	
	var example2 = 2;
	var ship;
	var bullets;
	var engine;
	
	return {
		example: 3,
		
		create: function() {
			alert("ex2 -- " + example2);
			alert("ex3 -- " + this.example);
			this.ship = game.add.sprite(100, 100, 'this.ship');
			this.ship.frame = 0;
			this.ship.anchor.set(0.5);
			
			game.physics.enable(this.ship, Phaser.Physics.ARCADE);
			
			this.ship.body.maxVelocity.set(300);
		},
		
		update: function()
		{
			this.ship.body.angularDrag = 5000;
			
			if (cursors.left.isDown)
			{
				//this.ship.angle -= 4;
				this.ship.body.angularDrag = 0;
				this.ship.body.angularVelocity = -turnSpeed;
			}
			else if (cursors.right.isDown)
			{
				//this.ship.angle += 4;
				this.ship.body.angularDrag = 0;
				this.ship.body.angularVelocity = turnSpeed;
			}
			
			var v2 = game.physics.arcade.velocityFromAngle(this.ship.angle-90, maxSpeed);
			if (!cursors.up.isDown)
			{
				this.ship.body.acceleration.set(0);
			}
			else
			{
				game.physics.arcade.accelerationFromRotation(this.ship.rotation-(3.14159/2), acceleration, this.ship.body.acceleration);
			}
			
			if (this.ship.body.speed > maxSpeed) {
				var q = maxSpeed / Math.sqrt(Math.pow(this.ship.body.velocity.x, 2) + Math.pow(this.ship.body.velocity.y, 2));
				//writeDebug2([
				//		maxSpeed,
				//		Math.sqrt(Math.pow(this.ship.body.velocity.x, 2) + Math.pow(this.ship.body.velocity.y, 2)),
				//		q+""
				//	]);
				this.ship.body.velocity.x *= q;
				this.ship.body.velocity.y *= q;
			}
			
			//this.ship.body.maxVelocity = new Phaser.Point(100, 100);
			
			//writeDebug(
			//		[
			//			"speed:           " + Math.round(this.ship.body.speed),
			//			"velocity:        " + roundPoint(this.ship.body.velocity),
			//			"max velocity:    " + roundPoint(this.ship.body.maxVelocity),
			//			"correct max vel: " + roundPoint(v2),
			//			"drag:            " + roundPoint(this.ship.body.drag),
			//			"new velocity:    " + roundPoint(this.ship.body.newVelocity),
			//		]);
			
			setthis.shipFrame();
			
			screenWrap(this.ship);
		}
	
	}
});