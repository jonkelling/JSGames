
define(['AsteraxSprite'], function(AsteraxSprite) {
	
	var module = function(game, x, y, key, frame) {
		AsteraxSprite.call(this, game, 0, 0, key, frame);
		
		this.body.setCollisionGroup(app.bulletsCollisionGroup);
		this.body.collides([app.rocksCollisionGroup]);
		this.body.onBeginContact.add(hitRock, this);
		
		this.weapon = null;
	}
	
	module.prototype = Object.create(AsteraxSprite.prototype);
	module.prototype.constructor = module;
	
	module.prototype.thrust = function(speed, rotation, asDegrees)
	{
		var saveRotation = this.rotation;
		this.body.rotation = (asDegrees ? game.math.degToRad(rotation) : rotation);
		this.body.thrust(speed);
		drawThrustDirectionLine(this);
		this.body.rotation = saveRotation;
	};
	
	Object.defineProperty(module.prototype, "center", {
		get: function() {
			var mod = (3/8);
			return this.position.clone().subtract(this.body.data.velocity[0]*mod, this.body.data.velocity[1]*mod);
		}
	});
	
	return module;
	
	function hitRock(rock)
	{
		if (this.alive)
		{
			if (rock.sprite.alive && this.weapon.beforeHitRock)
			{
				this.weapon.beforeHitRock(this, rock);
			}
			
			if (this.weapon.config.autoKillRock == true)
			{
				this.kill();
				rock.sprite.kill();
				
			}
			
			if (rock.sprite.alive && this.weapon.afterHitRock)
			{
				this.weapon.afterHitRock(this, rock);
			}
		}
		else
		{
			//app.debug.writeDebug2(['dead!']);
		}
	}
	
	function drawThrustDirectionLine(bullet) {
		var line = bullet.thrustDirectionLine = bullet.thrustDirectionLine || new Phaser.Line();
		
		line.start.setTo(bullet.center.x, bullet.center.y);
		line.end.setTo(bullet.center.x, bullet.center.y);
		
		var shift = new Phaser.Point(20, 0);
		shift.rotate(0, 0, bullet.body.rotation + app.PIOver2);
		line.end.add(shift.x, shift.y);
		
		game.debug.geom(line);
	}
	
});