
define(['AsteraxSprite'], function(AsteraxSprite) {
	
	var module = function(moduleName)
	{
		this.group = game.add.group();
		
		this.group.enableBody = true;
		this.group.physicsBodyType = Phaser.Physics.P2JS;
		this.group.classType = require(moduleName);
	};
	
	module.prototype.constructor = module;
	
	module.prototype.loadWeaponMods = func(mods)
	{
		
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