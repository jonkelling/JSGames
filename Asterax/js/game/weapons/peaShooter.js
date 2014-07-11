
define(['weapon', 'bullet'], function(Weapon) {
	
	var module = function()
	{
		Weapon.call(this, "peaShooter");
	}
	
	module.prototype = Object.create(Weapon.prototype);
	module.prototype.constructor = module;
	
	// module.prototype.getBulletClass = function()
	// {
	// 	return Bullet;
	// }
	
	return module;
	
});