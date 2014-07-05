
define(['weapon'], function(Weapon) {

	var module = function()
	{
		Weapon.call(this, "explodingShot");
	}

	module.prototype = Object.create(Weapon.prototype);
	module.prototype.constructor = module;



	return module;

});