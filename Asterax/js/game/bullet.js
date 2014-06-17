
define(['AsteraxSprite'], function(AsteraxSprite) {
	
	var module = function(game, x, y, frame, group) {
		AsteraxSprite.call(this, game, 0, 0, 'bullet');
		
		this.body.setCollisionGroup(app.bulletsCollisionGroup);
		this.body.collides([app.rocksCollisionGroup]);
		this.body.onBeginContact.add(hitRock, this);
	}
	
	module.prototype = Object.create(AsteraxSprite.prototype);
	module.prototype.constructor = module;
	
	return module;
	
	function hitRock(rock)
	{
		if (this.alive && rock.sprite.alive)
		{
			this.kill();
			rock.sprite.kill();
		}
		else
		{
			//writeDebug2(['dead!']);
		}
	}
	
});