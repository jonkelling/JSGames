
define(['Phaser'], function() {

    var module = function()
    {
        Phaser.Game.apply(this, arguments);
    };

    module.prototype = Object.create(Phaser.Game.prototype);
    module.constructor = module;

    return module;

});
