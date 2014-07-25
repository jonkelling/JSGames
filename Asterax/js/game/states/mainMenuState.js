
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

        create: function()
        {
            game.add.text(50, 50, "Asterax", {font:"96px arial", fill:"#ffffff"});
            game.add.text(50, 150, "2014", {font:"48px arial", fill:"#ffffff"});
            var buttons = [
                game.add.button(200, 250, "grayButton", startButtonClicked, this),
                game.add.button(320, 250, "grayButton", creditsButtonClicked, this)
            ];
            var texts = [
                game.add.text(buttons[0].position.x + grayButtonSize.width/5, buttons[0].position.y + grayButtonSize.height/4, "NEW GAME", {font:buttonFont, fill:"#333333", align:"center"}),
                game.add.text(buttons[1].position.x + grayButtonSize.width/4, buttons[1].position.y + grayButtonSize.height/4, "CREDITS", {font:buttonFont, fill:"#333333", align:"center"})
            ];
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

    function startButtonClicked(button)
    {
        game.state.start('Gameplay');
    }

    function creditsButtonClicked(button)
    {
        game.state.start('Credits');
    }

});