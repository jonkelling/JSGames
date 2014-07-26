
define(['twinShot', 'weapon'], function(TwinShot, Weapon) {

	var module = function(parent)
	{
		TwinShot.call(this, parent, "tripleShot");
		
		this.firingSecondShots = false;
		this.firingThirdShot = false;
	}

	module.prototype = Object.create(TwinShot.prototype);
	module.prototype.constructor = module;
	
	module.prototype.fire = function(force)
	{
		if (this.group.countDead() < 3 && !this.firingSecondShot && !this.firingThirdShot)
		{
			return;
		}
		Weapon.prototype.fire.call(this, force);
	};
	
	module.prototype.afterFire = function(bullet)
	{
		if (this.firingThirdShot == false)
		{
			this.firingThirdShot = true;
			TwinShot.prototype.afterFire.call(this, bullet);
			this.fire(true);
		}
		else if (this.firingSecondShot)
		{
			TwinShot.prototype.afterFire.call(this, bullet);
		}
		else
		{
			this.firingThirdShot = false;
		}
	};
	
	return module;

});