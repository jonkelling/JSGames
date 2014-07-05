
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
	
	return module;
	
	function hitRock(rock)
	{
		if (this.alive && rock.sprite.alive)
		{
			if (this.weapon && this.weapon.beforeHitRock)
			{
				this.weapon.beforeHitRock(this, rock);
			}
			
			if (!this.weapon || this.weapon.config.autoKillRock === true)
			{
				this.kill();
				rock.sprite.kill();
			}
			
			if (this.weapon && this.weapon.afterHitRock)
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