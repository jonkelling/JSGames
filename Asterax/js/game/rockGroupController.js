
define(['rock'], function() {
	
	//var write1;
	
	var module = function() {
	}
	
	module.prototype = {
		constructor: module,
		
		create: function()
		{
			//setTimeout(function() { window.location.reload() }, 1500);
			this.rocks = game.add.group();
			
			this.rocks.enableBody = true;
			this.rocks.physicsBodyType = Phaser.Physics.P2JS; // is this line redundant because of the next one??
			
			for (var i=0; i < 6; i++) {
				var name = 'rock' + (i % 4);
				setupNewRock(this.rocks.create(game.world.randomX, game.world.randomY, name), name);
				//setupNewRock(this.rocks.create(100, 621, name), name);
			}
		},
		
		update: function() {
			this.rocks.forEach(function (r) {
				game.world.wrap(r.body, Math.round(Math.max(r.width, r.height) / 2), false);
			});
		}
	};
	
	return module;
	
	function getRandomVelocityForRock() {
		var x = game.rnd.integerInRange(20, 90);
		var n = 1 - (2 * game.rnd.integerInRange(0, 1)); // 1 or -1
		return x * n;
	}
	
	function setupNewRock(r, name) {
		//r.anchor.set(0.5);
		r.name = name;
		var velocity = new Phaser.Point(getRandomVelocityForRock(), getRandomVelocityForRock());
		r.body.velocity.x = velocity.x;
		r.body.velocity.y = velocity.y;
		
		while (Math.abs(r.body.angularVelocity) < 0.2)
			// 0.2 is effectively the min rotate speed here
			r.body.angularVelocity = game.rnd.normal();
		
		r.outOfBoundsKill = false;
		
		r.x2 = game.width / 2;
		r.y2 = game.height / 2;
		r.body.gravityScale = 0;
		r.body.angularDamping = 0;
		r.body.damping = 0;
		r.body.mass = 2;
		r.body.clearShapes();
		r.body.addPhaserPolygon('rocks', r.name);
		
		r.body.setCollisionGroup(app.rocksCollisionGroup);
		r.body.collides([app.shipCollisionGroup, app.bulletsCollisionGroup]);
		
		r.body.debug = app.showPolygons;
		return r;
	}
	
});
