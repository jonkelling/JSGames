
define(['gameStageRecord'], function(GameStageRecord) {

    /* Terminology
     * -----------
     * Stage: aka game level, new arrangement of rocks. Higher stages have more rocks, crystals, power-ups, etc.
     *
     */

    var module = function (game)
    {
        this.game = game;
        this.currentStage = 0;
        this.stageRecords = new Phaser.ArrayList();
        this.currentStageRecord = null;
    };

    module.prototype.constructor = module;

    module.prototype.createNewStageAndMakeItCurrentStage = function ()
    {
        this.currentStageRecord = new GameStageRecord();
        this.stageRecords.add(this.currentStageRecord);
    };

    return module;
});