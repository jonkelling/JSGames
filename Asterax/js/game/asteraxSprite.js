define(['Phaser'], function() {
	
	var module = function(game, x, y, key, frame)
	{
		Phaser.Sprite.call(this, game, x, y, key, frame);
		game.physics.p2.enable(this, app.showPolygons);
		this.smoothed = !app.renderForOldDevice;
		this.anchor.setTo(0.5);

        this.events.onWrapped = new Phaser.Signal();
	};
	
	module.prototype = Object.create(Phaser.Sprite.prototype);
	module.prototype.constructor = module;

    module.prototype.update = function ()
    {
        this.wrap();
    };
	
	module.prototype.wrap = function()
	{
        if (!this.exists)
        {
            return;
        }
        var saveX = this.x;
        var saveY = this.y;
		this.game.world.wrap(this, Math.round(Math.max(this.width, this.height) / 2)-1, false);
        if (this.x != saveX || this.y != saveY)
        {
            this.body.x = this.x;
            this.body.y = this.y;
            this.events.onWrapped.dispatch(new Phaser.Point(saveX, saveY));
        }
	};
	
	module.prototype.angleTo = function(sprite, asDegrees)
	{
		if (sprite instanceof Phaser.Sprite)
		{
			sprite = sprite.position;
		}
		return this.position.angle(sprite, asDegrees);//+app.PIOver2;
	};

    module.prototype.destroy = function(destroyChildren)
    {
        this.events.onWrapped.dispose();
        Phaser.Sprite.prototype.destroy.apply(this, arguments);
    };

	Object.defineProperty(module.prototype, "anglePerp", {
		get: function() { return this.angle - 90; }
	});
	Object.defineProperty(module.prototype, "rotationPerp", {
		get: function() { return this.rotation - app.PIOver2; }
	});
	Object.defineProperty(module.prototype, "rawVelocity", {
		get: function() {
			this.body.data.rawVelocity = this.body.data.rawVelocity || new Phaser.Point();
			this.body.data.rawVelocity.setTo(this.body.data.velocity[0], this.body.data.velocity[1]);
			return this.body.data.rawVelocity;
		}
	});
	Object.defineProperty(module.prototype, "rawVelocityNegative", {
		get: function() {
			return this.rawVelocity.negative();
		}
	});
	Object.defineProperty(module.prototype, "previousPosition", {
		get: function() {
			this._previousPosition = this._previousPosition || new Phaser.Point();
			this._previousPosition.copyFrom(this.position);
			this._previousPosition.subtract(this.deltaX, this.deltaY);
			return this._previousPosition;
		}
	});
	Object.defineProperty(module.prototype, "positionPerp", {
		get: function() {
			return this.position.clone().perp().perp();
		}
	});
	Object.defineProperty(module.prototype, "previousPositionPerp", {
		get: function() {
			return this.previousPosition.clone().perp().perp();
		}
	});
	Object.defineProperty(module.prototype, "left", { get: function() { return this.x - (this.width / 2); } });
	Object.defineProperty(module.prototype, "top", { get: function() { return this.y - (this.width / 2); } });
	Object.defineProperty(module.prototype, "right", { get: function() { return this.x + (this.width / 2); } });
	Object.defineProperty(module.prototype, "bottom", { get: function() { return this.y + (this.width / 2); } });
	Object.defineProperty(module.prototype, "center", { get: function() { return this.position; } });
	Object.defineProperty(module.prototype, "speed", {
		get: function() {
			return this.rawVelocity.getMagnitude();
		}
	});
	
	return module;
	
});