define(['AsteraxSprite'], function(AsteraxSprite) {

	var module = function(game, x, y, key, frame)
	{
		AsteraxSprite.call(this, game, x, y, key, frame);
		this.events.onKilled.add(this.destroy, this);
	}

	module.prototype = Object.create(AsteraxSprite.prototype);
	module.prototype.constructor = module;

	return module;

});