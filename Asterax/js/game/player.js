define(['ship', 'loadout'], function (Ship, Loadout) {
	
	var engine;
	
	var module = function() {
		this.invincible = game.cache.getJSON("config").player.invincible;
	};
	
	module.prototype = {
		constructor: module,
		
		create: function()
		{
			this.shipGroup = game.add.group();
			this.shipGroup.enableBody = true;
			this.shipGroup.physicsBodyType = Phaser.Physics.P2JS;
			this.shipGroup.classType = Ship;
			this.ship = this.shipGroup.create();
			this.ship.player = this;
			
			// this.bullets2 = new Bullets();
			// this.bullets2.create();
		},
		
		update: function()
		{
//			this.ship.update();
		}
	};
	
	/****** Not sure if I want this in two spots *******/
	// Object.defineProperty(module.prototype, "maxLiveBullets", {
	// 	get: function() { return this.bullets.maxLiveBullets; },
	// 	set: function(value) { this.bullets.maxLiveBullets = value; }
	// });
	
	return module;
});

