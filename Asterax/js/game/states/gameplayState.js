
define(['player', 'rock', 'rockGroupController', 'loadout', 'popupView', 'mainMenuView', 'gameplayView', 'hudView','BinarySerpentsFilter','BlurXFilter','BlurYFilter','CausticLightFilter','CheckerWaveFilter','ColorBarsFilter','FireFilter','GrayFilter','HueRotateFilter','LightBeamFilter','MarbleFilter','PlasmaFilter','TunnelFilter'], function (Player, Rock, RockGroupController, Loadout, PopupView, MainMenuView, GameplayView, HUDView) {

    return {
        preload: function()
        {
            game.load.image('blueButton', 'images/blue-button.png');
            game.load.image('grayButton', 'images/gray-button.png');

            game.load.image('popupEdge', 'images/backgrounds/popupEdge.png');
            game.load.image('popupLargeCorner', 'images/backgrounds/popupLargeCorner.png');
            game.load.image('popupSmallCorner', 'images/backgrounds/popupSmallCorner.png');

            game.load.spritesheet('ship', 'images/ship/Ship.png', 64, 64);
            game.load.image('shield', 'images/shield.png');
            game.load.image('rock0', 'images/rocks/asteroid_3ds.png');
            game.load.image('rock1', 'images/rocks/badking.png');
            game.load.image('rock2', 'images/rocks/lutetia.png');
            game.load.image('rock3', 'images/rocks/vesta.png');

            game.load.image('rock0_med0', 'images/rocks/asteroid_3ds_med0.png');
            game.load.image('rock0_med1', 'images/rocks/asteroid_3ds_med1.png');
            game.load.image('rock0_med2', 'images/rocks/asteroid_3ds_med2.png');

            game.load.image('rock1_med0', 'images/rocks/rock1_med0.png');
            game.load.image('rock1_med1', 'images/rocks/rock1_med1.png');
            game.load.image('rock1_med2', 'images/rocks/rock1_med2.png');

            game.load.image('rock2_med0', 'images/rocks/rock2_med0.png');
            game.load.image('rock2_med1', 'images/rocks/rock2_med1.png');
            game.load.image('rock2_med2', 'images/rocks/rock2_med2.png');

            game.load.image('rock3_med0', 'images/rocks/rock3_med0.png');
            game.load.image('rock3_med1', 'images/rocks/rock3_med1.png');
            game.load.image('rock3_med2', 'images/rocks/rock3_med2.png');

            game.load.image('rock_sm0', 'images/rocks/rock_sm0.png');
            game.load.image('rock_sm1', 'images/rocks/rock_sm1.png');
            game.load.image('rock_sm2', 'images/rocks/rock_sm2.png');
            game.load.image('rock_sm3', 'images/rocks/rock_sm3.png');

            game.load.image('fire1', 'assets/particles/fire1.png');
            game.load.image('fire2', 'assets/particles/fire2.png');
            game.load.image('fire3', 'assets/particles/fire3.png');
            game.load.image('muzzleflash2', 'assets/particles/muzzleflash2.png');
            game.load.image('muzzleflash3', 'assets/particles/muzzleflash3.png');
            game.load.image('muzzleflash7', 'assets/particles/muzzleflash7.png');
            game.load.image('smoke-puff', 'assets/particles/smoke-puff.png');
            game.load.image('white-smoke', 'assets/particles/white-smoke.png');
            game.load.image('yellow', 'assets/particles/yellow.png');
            game.load.spritesheet('grayscale', 'assets/particles/grayscale.png', 1, 1);


            game.load.image('bullet', 'images/bullet.png');
            game.load.image('bullet-white', 'images/bullet-white.png');
            game.load.image('bullet-white-tail', 'images/bullet-white-tail.png');

            game.load.image('background', 'images/backgrounds/galaxy-starry-night.jpg');


            game.load.physics('ship', 'assets/physics/shipSprites.json');
            game.load.physics('rocks', 'assets/physics/rockSprites.json');
            game.load.physics('bullets', 'assets/physics/bulletSprites.json');

            game.load.json('rockpositions', 'assets/rockSpritePositions.json');
            game.load.json('config', 'assets/config.json');
        }
        ,

        init: function()
        {
            this.game.time.advancedTiming = true;
//            setTimeout(function(){this.game.time.fpsMin = 100;},1000);

            setupGlobalKeys();

            //	Enable p2 physics
            game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.setImpactEvents(true);
            game.physics.p2.useElapsedTime = app.renderForOldDevice;

            //  Make things a bit more bouncey
            game.physics.p2.defaultRestitution = 0.4;

            game.physics.p2.setBoundsToWorld(false, false, false, false, false);

            app.shipCollisionGroup = game.physics.p2.createCollisionGroup();
            app.rocksCollisionGroup = game.physics.p2.createCollisionGroup();
            app.bulletsCollisionGroup = game.physics.p2.createCollisionGroup();
            game.physics.p2.updateBoundsCollisionGroup();

            app.cursors = game.input.keyboard.createCursorKeys();
            app.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.C);
            app.testButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            app.testButton2 = game.input.keyboard.addKey(Phaser.Keyboard.G);

            // game.enableStep();
            app.testButton.onDown.add(function() {
//                this.view.paused = !this.view.paused;
//                return;

                // var _w = require('peaShooter');
                // var w = new _w();
                // w.loadWeaponMods([5,1,2]);
                // game.paused = !game.paused;
                this.game.enableStep();
                this.game.step();

                if (app.disableStepTimeout)
                {
                    window.clearTimeout(app.disableStepTimeout);
                    app.disableStepTimeout = null;
                }

                // app.disableStepTimeout = window.setTimeout(function() {game.disableStep();}, 5000);
            }, this);

            app.testButton2.onDown.add(function() {
                game.disableStep();
            });

            app.escapeButton.onDown.add(showNewGameScreen, this);

            if ($('#debugdivs').length == 0)
            {
                $('body').append('<div id="debugdivs" style="position: absolute; left: ' + (game.canvas.offsetWidth + 10) + 'px; top: 20px; width:200px;">' +
                    // '<input id="engine1button" type="button" value="engine 1"/><br/>' +
                    // '<input id="engine2button" type="button" value="engine 2"/><br/>' +
                    // '<input id="engine3button" type="button" value="engine 3"/>' +
                    '<div id="debugdiv3"></div>' +
                    '<div id="debugdiv4"></div>' +
                    '<div id="debugdiv5"></div>' +
                    '</div>');
                //
                // $('#engine1button').click(function() { acceleration = 100; });
                // $('#engine2button').click(function() { acceleration = 400; });
                // $('#engine3button').click(function() { acceleration = 800; });
            }
        }
        ,

        create: function()
        {
            if (this.view)
            {
                this.game.world.add(this.view);
//                this.view.exists = this.view.visible = this.view.alive = true;
//                this.game.state.start("Gameplay", false, false);
//                this.game.state.resume();
                return;
            }

            this.view = new GameplayView();

            if (!app.renderForOldDevice)
                app.background = this.add.tileSprite(0, 0, game.width, game.height, 'background', 0, this.view);

            this.game.player = app.player = new Player(this.view);
            this.game.player.create();

            this.game.player.ship.events.onKilled.addOnce(showNewGameScreen, this);

            this.game.rockGroupController = app.rockGroupController = new RockGroupController(this.view);
            this.game.rockGroupController.create();
            
            this.view.hud = this.view.add(new HUDView(this.game));
//            var lb = new Phaser.Filter.CheckerWave(this.game);
//            this.view.hud.filters = [lb];

//            var fire = new Phaser.Filter.Tunnel(this.game);

//            this.game.player.ship.filters = [new Phaser.Filter.Tunnel(this.game)];

//            this.fireSprite = this.view.create(0, 0);
//            this.view.sendToBack(this.fireSprite);
//            this.view.moveUp(this.fireSprite);
//            this.fireSprite.width = this.game.width;
//            this.fireSprite.height = this.game.height;
//            this.view.filters = [fire];
//            this.fireSprite.filters[0].alpha = 0.1;

            window.b = this.game.add.bitmapData(this.game.width, this.game.height);
            this.view.create(0, 0, window.b);
            window.c = window.b.context;
            window.c.strokeStyle = Phaser.Color.createColor(255, 255, 255, 1).rgba;
            window.c.lineWidth = 1;
            window.c.strokeThickness = 1;
        }
        ,

        update: function()
        {
            this.game.player.update();
//            this.view.filters[0].update();
//            this.fireSprite.filters[0].update();

            if (this.game.player.ship.filters)
            {
                this.game.player.ship.filters[0].update();
            }

            if (this.game.time.advancedTiming)
            {
                app.debug.writeDebug([this.game.time.fps, this.game.time.fpsMin, this.game.time.msMax]);
            }
        }
        //,

//        onShutDownCallback: function()
//        {
//            if (this.mainMenuPopupView)
//                this.mainMenuPopupView.destroy();
//        }
    }

    function showNewGameScreen() {
        if (!PopupView.active)
        {
            var mainMenuView = new MainMenuView(this.game);

            var state = this.state;
            mainMenuView.startGameCallback = function()
            {
                this.view.destroy();
                this.view = null;
                state.restart(true, false);
            };
            mainMenuView.startGameCallbackContext = this;

            this.view.paused = true;
            PopupView.show(this.game, mainMenuView, function()
            {
                this.view.paused = false;
            }, this);
        }
    }
});