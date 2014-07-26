
define(['Phaser'], function() {

    var module = function () {
        Phaser.Group.call(this, game);
    };

    module.prototype = Object.create(Phaser.Group.prototype);
    module.prototype.constructor = module;

    return module;
});