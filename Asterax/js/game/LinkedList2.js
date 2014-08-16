
define(['Phaser'], function () {

    var module = function ()
    {
        Phaser.LinkedList.call(this);
    };

    module.prototype = Object.create(Phaser.LinkedList.prototype);
    module.prototype.constructor = module;

    module.prototype.destroy = function ()
    {
        if (!this.isDestroying)
        {
            this.isDestroying = true;
            while (this.first)
                this.remove(this.first);
        }
    };

    module.prototype.reset = function ()
    {
        this.destroy();
        Phaser.LinkedList.prototype.reset.call(this);
    };

    module.prototype.remove = function(child)
    {
        Phaser.LinkedList.prototype.remove.apply(this, arguments);

        if (child.destroy)
        {
            child.destroy();
        }
    };

    module.prototype.callAll2 = function (callback, callbackContext) {

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

    };

    return module;

});