
define(['mainMenuView'], function(MainMenuView) {

    var module = function()
    {
    };

    module.prototype =
    {
        constructor: module,

        preload: function()
        {
            this.load.image('blueButton', 'images/blue-button.png');
            this.load.image('grayButton', 'images/gray-button.png');
        }
        ,

        init: function ()
        {
            setupGlobalKeys();

            app.nButton.onDown.add(startGame);
            app.enterButton.onDown.add(startGame);
        }
        ,

        create: function ()
        {
            this.view = new MainMenuView(this.game);
            setupGame();
            this.view.createView();
            this.view.startGameCallback = startGame;
            this.view.openCreditsCallback = creditsButtonClicked;
        }
        ,

        update: function ()
        {

        }
        ,

        render: function ()
        {

        }
    };

    return module;

    function startGame()
    {
        if (this.started)
        {
            game.state.current = "Gameplay";
            game.state.resume();
        }
        else
        {
            game.state.start('Gameplay');//, false, false);
        }
        this.started = this.started || true;
    }

    function creditsButtonClicked(button)
    {
        game.state.start('Credits');
    }
});