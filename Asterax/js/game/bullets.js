define(['bullet'], function(Bullet) {
	
	var module = function(player) {
		this.data = {};
		this.maxLiveBullets = app.defaultMaxLiveBullets;
		this.player = player;
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
			this.currentBullet = this.bullets.getFirstAlive();
			if (this.currentBullet && this.currentBullet.body.data.world == null)
			{
				writeDebug2([this.currentBullet.body.velocity.x, this.currentBullet.body.velocity.y]);
			}
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
					
					nextBullet.reset(this.player.ship.x, this.player.ship.y);
					
					nextBullet.lifespan = this.lifespan;
					nextBullet.body.gravityScale = 0;
					nextBullet.body.damping = 0;
					nextBullet.body.angularDamping = 0;
					nextBullet.body.mass = 0.05;
					
					nextBullet.body.angle = this.player.ship.body.angle;
					nextBullet.body.moveForward(this.speed);
					nextBullet.body.data.velocity[0] += this.player.ship.body.data.velocity[0];
					nextBullet.body.data.velocity[1] += this.player.ship.body.data.velocity[1];
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