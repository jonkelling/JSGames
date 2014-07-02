define(['bullet'], function(Bullet) {
	
	var module = function(ship) {
		this.data = {};
		this.maxLiveBullets = app.defaultMaxLiveBullets;
		this.ship = ship;
		this.canFire = true;
		this.stopFire = false;
		this.fireRate = app.defaultFireRate;
		this.lifespan = app.defaultBulletLifespan;
		this.speed = app.defaultBulletSpeed;
	};
	
	module.prototype = {
		constructor: module,
		
		create: function()
		{
			this.bullets = game.add.group();
			
			this.bullets.enableBody = true;
			this.bullets.physicsBodyType = Phaser.Physics.P2JS;
			this.bullets.classType = Bullet;
			
			this.bullets.createMultiple(this.maxLiveBullets, 'bullet');
		},
		
		update: function()
		{
			this.bullets.callAll('wrap');
		},
		
		fireBullet: function()
		{
			var nextBullet = this.bullets.getFirstExists(false);
			
			if (!nextBullet)
			{
			}
			else
			{
				if (this.canFire) {
					this.canFire = false;
					game.time.events.add(this.fireRate, setCanFire, this);
					
					nextBullet.reset(this.ship.x, this.ship.y);
					
					nextBullet.lifespan = this.lifespan;
					nextBullet.body.gravityScale = 0;
					nextBullet.body.damping = 0;
					nextBullet.body.angularDamping = 0;
					nextBullet.body.mass = 0.05;
					
					nextBullet.body.angle = this.ship.body.angle;
					nextBullet.body.moveForward(this.speed);
					nextBullet.body.data.velocity[0] += this.ship.body.data.velocity[0];
					nextBullet.body.data.velocity[1] += this.ship.body.data.velocity[1];
					this.currentBullet = nextBullet;
				}
			}
		}
	};
	
	function setupNewBullet()
	{
		
	}
	
	function setCanFire()
	{
		this.canFire = true;
	}
	
	Object.defineProperty(module.prototype, "maxLiveBullets", {
		get: function() { return this.data.maxLiveBullets; },
		set: function(value) { this.data.maxLiveBullets = value; }
	});
	
	return module;
	
});