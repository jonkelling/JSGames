
define(['Phaser'], function() {

    var grayButtonSize = {width: 125, height: 52};
    var buttonFont = "14px arial";

    return {
        preload: function()
        {
            game.load.image('blueButton', 'images/blue-button.png');
            game.load.image('grayButton', 'images/gray-button.png');
        }
        ,

        init: function()
        {
            setupGlobalKeys();

            app.nButton.onDown.add(startGame);
            app.enterButton.onDown.add(startGame);
        }
        ,

        create: function()
        {
            setupGame();

            game.add.text(50, 50, "Asterax", {font:"96px arial", fill:"#ffffff"});
            game.add.text(50, 150, "2014", {font:"48px arial", fill:"#ffffff"});

            var buttons = app.buttons = [
                game.add.button(200, 250, "grayButton", startGame, this),
                game.add.button(320, 250, "grayButton", creditsButtonClicked, this)
            ];
            var texts = [
                game.add.text(buttons[0].position.x + grayButtonSize.width/5, buttons[0].position.y + grayButtonSize.height/4, "NEW GAME", {font:buttonFont, fill:"#333333", align:"center"}),
                game.add.text(buttons[1].position.x + grayButtonSize.width/4, buttons[1].position.y + grayButtonSize.height/4, "CREDITS", {font:buttonFont, fill:"#333333", align:"center"})
            ];

            glowButton(buttons[0]);
        }
        ,

        update: function()
        {

        }
        ,

        render: function()
        {
        }
    }

    function startGame()
    {
        game.state.start('Gameplay');
    }

    function creditsButtonClicked(button)
    {
        game.state.start('Credits');
    }

    function glowButton(button)
    {
        var t = game.add.tween(button);

        t.to({blueTint: 0x33, redTint: 0x33, greenTint: 0x99}, 850, Phaser.Easing.Quadratic.InOut, true, 0, Infinity, true);
    }

});