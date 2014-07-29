
define(['Phaser'], function() {

    var module = function (_game, parent) {
        Phaser.Group.apply(this, [_game || game, parent]);
    };

    module.prototype = Object.create(Phaser.Group.prototype);
    module.prototype.constructor = module;

    return module;
});