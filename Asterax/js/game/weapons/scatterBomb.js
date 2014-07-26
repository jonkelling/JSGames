
define(['weapon', 'homingShot', 'bullet'], function(Weapon, HomingShot, Bullet) {

    var numberOfBulletsPerScatter = 10;

	var module = function(parent)
	{
		Weapon.call(this, parent, "scatterBomb");

        this.scatterBomb = new HomingShot(parent, "bullet-white", "bullet-white-tail");
        this.scatterBomb.maxLiveBullets = 100;
        this.scatterBomb.loadWeaponMods([6]);

//        var me = this;
//        Object.defineProperty(this.scatterBomb, "ship", { get: function() { return me.ship; } });
	};

	module.prototype = Object.create(Weapon.prototype);
	module.prototype.constructor = module;

	// module.prototype.getBulletClass = function()
	// {
	// 	return Bullet;
	// };

    module.prototype.update = function()
    {
        Weapon.prototype.update.apply(this, arguments);
        this.scatterBomb.update();
    };

    module.prototype.bulletKilled = function(bullet)
    {
        for (var i = 0; i < numberOfBulletsPerScatter; i++)
        {
            var newBullet = this.scatterBomb.fire(true);
            if (newBullet)
            {
                setupNextScatterBombBullet(newBullet, bullet);
            }
        }
//        app.debug.writeDebug([this.group.countLiving(), this.scatterBomb.group.countLiving()]);
    };

    return module;

    function setupNextScatterBombBullet(bullet, parentBullet)
    {
        bullet.reset(parentBullet.position.x, parentBullet.position.y);
        bullet.body.setZeroVelocity();
        bullet.body.angle = game.rnd.angle();
        bullet.body.moveForward(game.rnd.integerInRange(50, 170));
    }

});