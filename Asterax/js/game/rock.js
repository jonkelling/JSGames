
define(function() {
	
	var module = function(x, y, size) {
		this.x = x;
		this.y = y;
		this.size = size ? size : 50;
	};
	
	module.prototype = {
		constructor: module,
		
		create: function()
		{
			
		},
		
		update: function()
		{
			var graphics = game.add.graphics(0, 0);
			
			graphics.lineStyle(0);
			graphics.beginFill(0xE2E2E2, 0.5);
			graphics.drawCircle(this.x, this.y, this.size / 2);
		}
	};
	
	return module;
	
});