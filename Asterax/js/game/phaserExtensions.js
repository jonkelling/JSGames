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
        get: function() { return this.tint >> 16; },
        set: function(value) { this.tint = (this.tint & 0x00ffff) + (value << 16); }
    });

    Object.defineProperty(PIXI.Sprite.prototype, "greenTint", {
        get: function() { return this.tint >> 16; },
        set: function(value) { this.tint = (this.tint & 0xff00ff) + (value << 8); }
    });

    Object.defineProperty(PIXI.Sprite.prototype, "blueTint", {
        get: function() { return this.tint >> 16; },
        set: function(value) { this.tint = (this.tint & 0xffff00) + (value << 0); }
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
	
});