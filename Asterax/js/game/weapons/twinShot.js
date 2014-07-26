
define(['weapon'], function(Weapon) {

	var module = function(parent, moduleName)
	{
		Weapon.call(this, parent, moduleName || "twinShot");
		
		this.firingSecondShot = false;
	}

	module.prototype = Object.create(Weapon.prototype);
	module.prototype.constructor = module;
	
	module.prototype.fire = function(force)
	{
		if (this.group.countDead() < 2 && !this.firingSecondShot)
		{
			return;
		}
		Weapon.prototype.fire.call(this, force);
	};
	
	module.prototype.afterFire = function(bullet)
	{
		if (this.firingSecondShot == false)
		{
			offsetBullet(bullet, this.ship.body.rotation);
			
			this.firingSecondShot = true;
			this.fire(true);
		}
		else
		{
			offsetBullet(bullet, this.ship.body.rotation+(Math.PI));
			
			this.firingSecondShot = false;
		}
	}
	
	return module;
	
	function offsetBullet(bullet, rotation)
	{
		var sidewaysVelocity = new Phaser.Point(1.35, 0);
		sidewaysVelocity.rotate(0, 0, rotation);
		bullet.body.data.velocity[0] += sidewaysVelocity.x;
		bullet.body.data.velocity[1] += sidewaysVelocity.y;
	}
	
});