
define(['weapon'], function(Weapon) {

	var module = function()
	{
		Weapon.call(this, "twinShot");
	}

	module.prototype = Object.create(Weapon.prototype);
	module.prototype.constructor = module;



	return module;

});