
define(['AsteraxSprite'], function(AsteraxSprite) {
	
	var module = function() {
		AsteraxSprite.call(this, game);
	};
	
	module.prototype = Object.create(AsteraxSprite.prototype);
	module.prototype.constructor = module;
	
	return module;
});