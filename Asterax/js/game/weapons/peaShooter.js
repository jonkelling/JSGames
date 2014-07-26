
define(['weapon', 'bullet'], function(Weapon) {
	
	var module = function(parent)
	{
		Weapon.call(this, parent, "peaShooter");
	}
	
	module.prototype = Object.create(Weapon.prototype);
	module.prototype.constructor = module;
	
	// module.prototype.getBulletClass = function()
	// {
	// 	return Bullet;
	// }
	
	return module;
	
});