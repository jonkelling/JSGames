
define(['Phaser'], function() {

    var module = function (_game, parent) {
        Phaser.Group.call(this, _game || game, parent);
        this._paused = false;
    };

    module.prototype = Object.create(Phaser.Group.prototype);
    module.prototype.constructor = module;

    module.prototype.pause = function()
    {
    };

    module.prototype.resume = function()
    {
    };

    Object.defineProperty(module.prototype, "paused", {
        get: function()
        {
            return this._paused;
        }
        ,
        set: function(value)
        {
            if (this._paused == value)
            {
                return;
            }

            this._paused = value;

            if (this._paused)
            {
                this.exists = false;
                this.setAllChildren('exists', false, false, false);
                this.setAllChildren('visible', true, true, false);
            }
            else
            {
                this.exists = true;
                this.setAllChildren('exists', true, true, false);
            }
        }
    });

    return module;
});