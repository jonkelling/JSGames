
define(['TailEmitterParticle'], function(TailEmitterParticle) {

    var module = function(game, x, y, maxParticles) {
        Phaser.Particles.Arcade.Emitter.apply(this, arguments);
        this.particleClass = TailEmitterParticle;
        this.autoScale = false;
    };

    module.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
    module.prototype.constructor = module;

    module.prototype.emitParticle = function()
    {
        if (this.tailedSprite)
        {
            this.emitX = this.tailedSprite.center.x;
            this.emitY = this.tailedSprite.center.y;
        }
        Phaser.Particles.Arcade.Emitter.prototype.emitParticle.apply(this, arguments);
    };

    module.prototype.update = function()
    {
        Phaser.Particles.Arcade.Emitter.prototype.update.apply(this, arguments);
    };

    Object.defineProperty(module.prototype, "on", {
        get: function() { return this.tailedSprite && this.tailedSprite.exists; }
    });

    Object.defineProperty(module.prototype, "tailedSprite", { writable: true });

    return module;
});