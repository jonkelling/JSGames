
define(['weapon'], function(Weapon) {

	var module = function()
	{
		Weapon.call(this, "homingShot");
	}

	module.prototype = Object.create(Weapon.prototype);
	module.prototype.constructor = module;



	return module;

});