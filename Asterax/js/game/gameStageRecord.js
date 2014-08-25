
define(function ()
{

    var module = function ()
    {
        this.stageNumber = 0;
        this.points = 0;
        this.timeStarted = 0;
        this.timeCompleted = 0;
        this.timeToComplete = 0;
        this.numberOfRocks = 0;
        this.numberOfCrystals = 0;
        this.numberOfLifePowerUps = 0;
        this.rocksDestroyed = 0;
        this.shotsFired = 0;
        this.collisions = 0;
        this.shipsLost = 0;
        this.lifeLost = 0;
        this.crystalsCollected = 0;
        this.lifePowerUpsCollected = 0;
    };

    module.prototype.constructor = module;

    module.prototype.something = function ()
    {
    };

    return module;
});