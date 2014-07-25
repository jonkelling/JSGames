
define(['Phaser'], function() {

    var module = function() {
        Phaser.Particle.apply(this, arguments);
        this.autoAlpha = false;
        this.autoScale = false;
    };

    module.prototype = Object.create(Phaser.Particle.prototype);
    module.prototype.constructor = module;

    module.prototype.onEmit = function()
    {
        this.body.angularVelocity = 0;
        this.saveRotation = this.parent.tailedSprite.rotation;
        this.saveVelocity = this.parent.tailedSprite.rawVelocity;
        this.rotation = this.saveRotation;
        this.body.velocity.setTo(0);
    };

    module.prototype.update = function()
    {
        Phaser.Particle.prototype.update.apply(this, arguments);
        this.body.angularVelocity = 0;
        this.body.velocity.setTo(0);
        this.tint = this.parent.tailedSprite.tint;

    };

    return module;
});