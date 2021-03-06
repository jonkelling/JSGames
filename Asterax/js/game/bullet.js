
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
	
	Object.defineProperty(module.prototype, "center", {
		get: function() {
			var mod = (3/8);
			return this.position.clone().subtract(this.body.data.velocity[0]*mod, this.body.data.velocity[1]*mod);
		}
	})
	
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
			//writeDebug2(['dead!']);
		}
	}
	
});