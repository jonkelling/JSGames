
define(['AsteraxSprite', 'loadout', 'bullet', 'require'], function(AsteraxSprite, Loadout, Bullet, require) {
	
	var module = function(moduleName)
	{
		this.group = game.add.group();
		
		this.group.enableBody = true;
		this.group.physicsBodyType = Phaser.Physics.P2JS;
		this.group.classType = Bullet;
	};
	
	module.prototype.constructor = module;
	
	module.prototype.loadWeaponMods = function(mods)
	{
		alert();
		var value = function(a, b) {
				return a.id == b.id ? 0 :
					   a.id  > b.id ? 1 :
					   a.id  < b.id ? 2 : 0;
			};
		mods = mods.sort(value);
		
		var defaults = Loadout.getWeaponMod(1);
		
		this.safe = defaults.safe;
		this.mass = defaults.mass;
		this.fireRate = defaults.fireRate;
		this.maxLiveBullets = defaults.maxLiveBullets;
		this.speed = defaults.speed;
		this.lifespan = defaults.lifespan;
		this.automatic = defaults.automatic;
		
		alert([
			this.safe,this.mass,this.fireRate,this.maxLiveBullets,this.speed,this.lifespan,this.automatic
			]);
	};
	
	module.prototype.update = function()
	{
		this.group.callAll('wrap');
	};
	
	module.prototype.fire = function()
	{
	};
	
	Object.defineProperty(module.prototype, "prop", {
		get: function() { return null; },
		set: function(value) { }
	});
	
	return module;
	
});