
define(['rock'], function(Rock) {
	
	var module = function() {
	}
	
	module.prototype = {
		constructor: module,
		
		create: function()
		{
			//setTimeout(function() { window.location.reload() }, 1500);
			this.rocks = game.add.group();
			this.rocks.classType = Rock;
			
			this.rocks.enableBody = true;
			this.rocks.physicsBodyType = Phaser.Physics.P2JS; // is this line redundant because of the next one??
			
			for (var i=0; i < 6; i++) {
				var name = 'rock' + (i % 4);
				this.rocks.create(game.world.randomX, game.world.randomY, name, 3);
			}
		},
		
		update: function() {
			this.rocks.callAll('wrap');
		}
	};
	
	return module;
	
});
