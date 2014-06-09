define(['ship'], function (Ship) {
	
	var bullets;
	var engine;
	
	var module = function() {
	};
	
	module.prototype = {
		constructor: module,
		
		create: function()
		{
			this.ship = new Ship();
			this.ship.create();
		},
		
		update: function()
		{
			this.ship.update();
		}
	};
	
	return module;
});

