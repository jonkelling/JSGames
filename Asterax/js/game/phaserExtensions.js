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

    Object.defineProperty(Phaser.Group.prototype, "events", {
        get: function() {
            if (this._events == undefined)
            {
                this._events = new Phaser.Events(this);
            }
            return this._events;
        },
        set: function(value) {
            this._events = value;
        }
    });

    Phaser.TweenManager.prototype.create = function (object, group)
    {
        var t = new Phaser.Tween(object, this.game, this);
        t.group = group;
        return t;
    };

    Phaser.LinkedList.prototype.callAll2 = function (callback, callbackContext) {

        if (!this.first || !this.last)
        {
            return;
        }

        var entity = this.first;

        do
        {
            if (entity)
            {
                callback.call(callbackContext, entity);
            }

            entity = entity.next;

        }
        while(entity != this.last.next);

    }



    /**
     * Resizes the BitmapData. This changes the size of the underlying canvas and refreshes the buffer.
     *
     * @method Phaser.BitmapData#resize
     */
    Phaser.BitmapData.prototype.resize = function (width, height) {

        if (width !== this.width || height !== this.height)
        {
            this.width = width;
            this.height = height;

            this.canvas.width = width;
            this.canvas.height = height;

            this.baseTexture.width = width;
            this.baseTexture.height = height;

            this.textureFrame.width = width;
            this.textureFrame.height = height;

            this.texture.width = width;
            this.texture.height = height;

            if (this.texture.crop)
            {
                this.texture.crop.width = width;
                this.texture.crop.height = height;
            }

            this.refreshBuffer();
            this.dirty = true;
        }

    };

    /**
     * This re-creates the BitmapData.imageData from the current context.
     * It then re-builds the ArrayBuffer, the data Uint8ClampedArray reference and the pixels Int32Array.
     * If not given the dimensions defaults to the full size of the context.
     *
     * @method Phaser.BitmapData#update
     * @param {number} [x=0] - The x coordinate of the top-left of the image data area to grab from.
     * @param {number} [y=0] - The y coordinate of the top-left of the image data area to grab from.
     * @param {number} [width] - The width of the image data area.
     * @param {number} [height] - The height of the image data area.
     */

    /**
     * DEPRECATED: This method will be removed in Phaser 2.1. Please use BitmapData.update instead.
     *
     * This re-creates the BitmapData.imageData from the current context.
     * It then re-builds the ArrayBuffer, the data Uint8ClampedArray reference and the pixels Int32Array.
     * If not given the dimensions defaults to the full size of the context.
     *
     * @method Phaser.BitmapData#refreshBuffer
     * @param {number} [x=0] - The x coordinate of the top-left of the image data area to grab from.
     * @param {number} [y=0] - The y coordinate of the top-left of the image data area to grab from.
     * @param {number} [width] - The width of the image data area.
     * @param {number} [height] - The height of the image data area.
     */
    Phaser.BitmapData.prototype.refreshBuffer = function (x, y, width, height) {

        if (typeof x === 'undefined') { x = 0; }
        if (typeof y === 'undefined') { y = 0; }
        if (typeof width === 'undefined') { width = this.width; }
        if (typeof height === 'undefined') { height = this.height; }

        this.imageData = this.context.getImageData(x, y, width, height);
        this.data = this.imageData.data;

        if (this.imageData.data.buffer)
        {
            this.buffer = this.imageData.data.buffer;
            this.pixels = new Uint32Array(this.buffer);
        }
        else
        {
            if (window['ArrayBuffer'])
            {
                this.buffer = new ArrayBuffer(this.imageData.data.length);
                this.pixels = new Uint32Array(this.buffer);
            }
            else
            {
                this.pixels = this.imageData.data;
            }
        }

    }


});