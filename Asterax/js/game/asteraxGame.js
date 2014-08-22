
define(['gameSession', 'Phaser'], function(GameSession) {

    var module = function()
    {
        Phaser.Game.apply(this, arguments);
    };

    module.prototype = Object.create(Phaser.Game.prototype);
    module.constructor = module;

    module.prototype.startNewGame = function ()
    {
        this.session = new GameSession();
        this.state.start('Gameplay');
    };

    Object.defineProperty(module.prototype, "session", { writable: true });

    Object.defineProperty(module.prototype, "currentState", {
        get: function() { return this.state.getCurrentState(); }
    });

    Object.defineProperty(module.prototype, "currentView", {
        get: function() { return this.state.getCurrentState().view; }
    });

    Object.defineProperty(module.prototype, "rocks", {
        get: function() { return this.rockGroupController.rocks; }
    });

    return module;

});
