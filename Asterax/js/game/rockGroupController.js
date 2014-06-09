
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
			this.rocks.physicsBodyType = Phaser.Physics.P2JS;
			game.physics.p2.enable(this.rocks);
			
			for (var i=0; i < 6; i++) {
				var name = 'rock' + (i % 4);
				setupNewRock(this.rocks.create(game.world.randomX, game.world.randomY, name), name);
				//setupNewRock(this.rocks.create(100, 621, name), name);
			}
		},
		
		update: function() {
			var rocks = this.rocks;
			this.rocks.forEachDead(function (r) {
				
			});
		}
	};
	
	return module;
	
	function getRandomVelocityForRock() {
		var x = game.rnd.integerInRange(5, 90);
		var n = 1 - (2 * game.rnd.integerInRange(0, 1)); // 1 or -1
		return x * n;
	}
	
	function setupNewRock(r, name) {
		r.anchor.set(0.5);
		r.name = name;
		r.body.velocity = new Phaser.Point(getRandomVelocityForRock(), getRandomVelocityForRock());
		//r.body.velocity = new Phaser.Point(20, 100);
		//r.body.angularVelocity = getRandomVelocityForRock() * 2; //200;
		//r.checkWorldBounds = true;
		r.outOfBoundsKill = false;
		//r.events.onOutOfBounds.add(wrap);
		r.x2 = game.width / 2;
		r.y2 = game.height / 2;
		r.body.gravityScale = 0;
		return r;
	}
	
	function wrap(r) {
		var xOut = isOutOfBoundsX(r) && (Math.abs(r.x - r.x2) > r.width);
		var yOut = isOutOfBoundsY(r) && (Math.abs(r.y - r.y2) > r.height);
		
		/*if (write1)
			write1.push(Math.abs(r.y - r.y2));*/
		
		if (xOut) r.x = r.x2 = game.width - r.x;
		if (yOut) r.y = r.y2 = game.height - r.y;// > 0 ? game.height - r.y : -51.8);
		
		/*if (!write1) {
			writeDebug(write1 = [xOut, yOut, new Date().getTime(), [Math.round(r.x), Math.round(r.y)], [Math.round(r.x2), Math.round(r.y2)], r.body.angularVelocity]);
		}
		else {
			writeDebug(write1);
			writeDebug2([xOut, yOut, new Date().getTime(), [Math.round(r.x), Math.round(r.y)], [Math.round(r.x2), Math.round(r.y2)], r.body.angularVelocity]);
		}*/
		
		//r.checkWorldBounds = false;
		//setTimeout(function() { r.checkWorldBounds = true; }, 1000);
	}
	
	function isOutOfBoundsX(r) { return isOutOfBounds(r.x, game.width); }
	function isOutOfBoundsY(r) { return isOutOfBounds(r.y, game.height); }
	
	function isOutOfBounds(position, upperLimit) {
		return position < 0 || position > upperLimit;
	}
	
});
