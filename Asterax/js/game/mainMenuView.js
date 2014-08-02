
define(['view'], function(View) {

    var grayButtonSize = {width: 125, height: 52};
    var buttonFont = "14px arial";

    var module = function (game, parent) {
        this.events = new Phaser.Events(this);
        this.events.onAddedToGroup.addOnce(this.createView, this);
        this.startGameCallback = null;
        this.startGameCallbackContext = null;
        View.apply(this, arguments);
    };

    module.prototype = Object.create(View.prototype);
    module.prototype.constructor = module;

    module.prototype.createView = function()
    {
        setupGame();

        this.add(this.game.add.text(50, 50, "Asterax", {font: "96px arial", fill: "#ffffff"}));
        this.add(this.game.add.text(50, 150, "2014", {font: "48px arial", fill: "#ffffff"}));

        var buttons = [
            this.add(this.game.add.button(200, 250, "grayButton", startGame, this)),
            this.add(this.game.add.button(320, 250, "grayButton", openCredits, this))
        ];
        var texts = [
            this.add(this.game.add.text(buttons[0].position.x + grayButtonSize.width / 5, buttons[0].position.y + grayButtonSize.height / 4, "NEW GAME", {font: buttonFont, fill: "#333333", align: "center"})),
            this.add(this.game.add.text(buttons[1].position.x + grayButtonSize.width / 4, buttons[1].position.y + grayButtonSize.height / 4, "CREDITS", {font: buttonFont, fill: "#333333", align: "center"}))
        ];

        glowButton(buttons[0]);
    };

    return module;

    function startGame()
    {
        if (this.startGameCallback)
        {
            this.startGameCallback.call(this.startGameCallbackContext);
        }
    }

    function openCredits()
    {
        if (this.openCreditsCallback)
        {
            this.openCreditsCallback.call(this.openCreditsCallbackContext);
        }
    }

    function glowButton(button)
    {
        var t = game.add.tween(button);

        t.to({blueTint: 0x33, redTint: 0x33, greenTint: 0x99}, 850, Phaser.Easing.Quadratic.InOut, true, 0, Infinity, true);
    }
});