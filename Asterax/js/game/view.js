
define(['Phaser'], function() {

    var module = function (_game) {
        _game = _game || game;
        Phaser.Group.call(this, game);
    };

    module.prototype = Object.create(Phaser.Group.prototype);
    module.prototype.constructor = module;

    return module;
});