
define(['weapon', 'bullet'], function(Weapon/*, Bullet*/) {
	
	var module = function(parent)
	{
		Weapon.call(this, parent, ___moduleName___);
		// this.spriteKey = 'bullet';
	}
	
	module.prototype = Object.create(Weapon.prototype);
	module.prototype.constructor = module;
	
	// module.prototype.getBulletClass = function()
	// {
	// 	return Bullet;
	// };
	
	return module;
	
});