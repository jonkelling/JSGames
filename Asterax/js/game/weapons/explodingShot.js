
define(['weapon'], function(Weapon) {

	var module = function(parent)
	{
		Weapon.call(this, parent, "explodingShot");
	}

	module.prototype = Object.create(Weapon.prototype);
	module.prototype.constructor = module;



	return module;

});