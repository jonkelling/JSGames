define(['Phaser'], function(){

	Object.defineProperty(Phaser.Point.prototype, "rotation", {
		get: function() {
			return new Phaser.Point().angle(this);
		}
	});
	
	Object.defineProperty(Phaser.Point.prototype, "rotation90", {
		get: function() {
			return new Phaser.Point().angle(this) - (Math.PI/2);
		}
	});
	
	Object.defineProperty(Phaser.Point.prototype, "angle90", {
		get: function() {
			return new Phaser.Point().angle(this, true) - 90;
		}
	});

    Object.defineProperty(PIXI.Sprite.prototype, "redTint", {
        get: function() { return (this.tint & 0xff0000) >> 16; },
        set: function(value) { this.tint = (this.tint & 0x00ffff) | (value << 16); }
    });

    Object.defineProperty(PIXI.Sprite.prototype, "greenTint", {
        get: function() { return (this.tint & 0x00ff00) >> 8; },
        set: function(value) { this.tint = (this.tint & 0xff00ff) | (value << 8); }
    });

    Object.defineProperty(PIXI.Sprite.prototype, "blueTint", {
        get: function() { return (this.tint & 0x0000ff) >> 0; },
        set: function(value) { this.tint = (this.tint & 0xffff00) | (value << 0); }
    });

    // This is so setAllChildren will work when checkAlive == true
    Object.defineProperty(Phaser.TileSprite.prototype, "alive", {
        get: function()
        {
            if (this._alive == undefined)
                this._alive = true;
            return this._alive;
        }
        ,
        set: function(value)
        {
            this._alive = value;
        }
    });
	
	Phaser.Point.prototype.toStringFixed = function()
	{
		return "[" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + "]";
	}
	
	Phaser.Point.prototype.lineTo = function(a)
	{
		return new Phaser.Line(this.x, this.y, a.x, a.y);
	}
	
	Phaser.Point.prototype.negative = function()
	{
		return Phaser.Point.negative(this);
	}

    /**
     * Destroys this Group. Removes all children, then removes the container from the display list and nulls references.
     *
     * @method Phaser.Group#destroy
     * @param {boolean} [destroyChildren=true] - Should every child of this Group have its destroy method called?
     * @param {boolean} [soft=false] - A 'soft destroy' (set to true) doesn't remove this Group from its parent or null the game reference. Set to false and it does.
     */
    Phaser.Group.prototype.destroy = function (destroyChildren, soft) {

        if (this.game === null) { return; }

        if (typeof destroyChildren === 'undefined') { destroyChildren = true; }
        if (typeof soft === 'undefined') { soft = false; }

        this.removeAll(destroyChildren);

        this.cursor = null;
        this.filters = null;

        if (!soft)
        {
            if (this.parent)
            {
                this.parent.removeChild(this);
            }

            this.game = null;
            this.exists = false;

            if (this.events)
            {
                this.events.destroy();
            }
        }

    };

//    Phaser.TweenManager.prototype.create = function (object, group)
//    {
//        return new Phaser.Tween(object, this.game, this, group);
//    };
	
});