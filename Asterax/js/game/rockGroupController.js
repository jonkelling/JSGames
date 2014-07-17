
define(['rock'], function(Rock) {
	
	var nullAreaSize = {width: 300, height: 200};
	
	var module = function() {
	}
	
	module.prototype = {
		constructor: module,
		
		create: function()
		{
			//setTimeout(function() { window.location.reload() }, 1500);
			this.rocks = getNewGroup();
			
			for (var i=0; i < 12; i++) {
				var name = 'rock' + (i % 4);
				
				var randomPoint = getRandomPointOutsideNullArea();
				
				this.rocks.create(randomPoint.x, randomPoint.y, name, 3);
			}
			
			// this.rocks.create(650, 100, 'rock1', 3);
		},
		
		update: function() {
			this.rocks.callAll('wrap');
		}
	};
	
	return module;
	
	function getNewGroup(parent)
	{
		var group = parent	?	game.add.group(parent)
							:	game.add.group();
		group.classType = Rock;
		group.enableBody = true;
		group.physicsBodyType = Phaser.Physics.P2JS;
		
		return group;
	}
	
	function getRandomPointOutsideNullArea()
	{
		var point = {x:0,y:0};
		
		var modifiedWidth = game.width - nullAreaSize.width;
		var modifiedHeight = game.height - nullAreaSize.height;
		
		point.x = game.rnd.integerInRange(0, modifiedWidth);
		point.y = game.rnd.integerInRange(0, modifiedHeight);
		
		if (point.x > (modifiedWidth / 2))
			point.x += nullAreaSize.width;
		
		if (point.y > (modifiedHeight / 2))
			point.y += nullAreaSize.height;
		
		return point;
	}
	
});
