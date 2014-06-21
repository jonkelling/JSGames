
define(['rock'], function(Rock) {
	
	var module = function() {
	}
	
	module.prototype = {
		constructor: module,
		
		create: function()
		{
			//setTimeout(function() { window.location.reload() }, 1500);
			this.rocks = getNewGroup();
			
			for (var i=0; i < 6; i++) {
				var name = 'rock' + (i % 4);
				this.rocks.create(game.world.randomX, game.world.randomY, name, 3);
			}
		},
		
		update: function() {
			this.rocks.callAll('wrap');
		}
	};
	
	function getNewGroup(parent) {
		var group = parent	?	game.add.group(parent)
							:	game.add.group();
		group.classType = Rock;
		group.enableBody = true;
		group.physicsBodyType = Phaser.Physics.P2JS;
		
		return group;
	};
	
	return module;
	
});
