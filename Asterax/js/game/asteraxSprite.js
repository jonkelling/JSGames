define(['Phaser'], function() {
	
	var module = function(game, x, y, key, frame)
	{
		Phaser.Sprite.call(this, game, x, y, key, frame);
		game.physics.p2.enable(this, app.showPolygons);
		this.smoothed = false;
	}
	
	module.prototype = Object.create(Phaser.Sprite.prototype);
	module.prototype.constructor = module;
	
	module.prototype.wrap = function()
	{
		this.game.world.wrap(this.body, Math.round(Math.max(this.width, this.height) / 2)-1, false);
	};
	
	Object.defineProperty(module.prototype, "left", { get: function() { return this.x - (this.width / 2); } });
	Object.defineProperty(module.prototype, "top", { get: function() { return this.y - (this.width / 2); } });
	Object.defineProperty(module.prototype, "right", { get: function() { return this.x + (this.width / 2); } });
	Object.defineProperty(module.prototype, "bottom", { get: function() { return this.y + (this.width / 2); } });
	
	return module;
	
});