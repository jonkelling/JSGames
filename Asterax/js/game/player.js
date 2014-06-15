define(['ship', 'bullets'], function (Ship, Bullets) {
	
	var engine;
	
	var module = function() {
	};
	
	module.prototype = {
		constructor: module,
		
		create: function()
		{
			this.ship = new Ship();
			this.ship.create();
			
			this.bullets = new Bullets(this);
			this.bullets.create();
			
			app.fireButton.onDown.add(fireBullet, this);
			
			// this.bullets2 = new Bullets();
			// this.bullets2.create();
		},
		
		update: function()
		{
			this.ship.update();
			this.bullets.update();
		}
	};
	
	/****** Not sure if I want this in two spots *******/
	// Object.defineProperty(module.prototype, "maxLiveBullets", {
	// 	get: function() { return this.bullets.maxLiveBullets; },
	// 	set: function(value) { this.bullets.maxLiveBullets = value; }
	// });
	
	function fireBullet()
	{
		this.bullets.fireBullet();
	}
	
	return module;
});

