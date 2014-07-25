
define(['player', 'rock', 'rockGroupController', 'loadout', 'peaShooter'], function (Player, Rock, RockGroupController, Loadout) {

    return {
        preload: function()
        {
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

        create: function()
        {
            //	Enable p2 physics
            game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.setImpactEvents(true);

            //  Make things a bit more bouncey
            game.physics.p2.defaultRestitution = 0.4;

            game.physics.p2.setBoundsToWorld(false, false, false, false, false);

            if (!app.renderForOldDevice)
            {
                app.background = game.add.tileSprite(0, 0, game.width, game.height, 'background');
            }

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
                // var _w = require('peaShooter');
                // var w = new _w();
                // w.loadWeaponMods([5,1,2]);
                // game.paused = !game.paused;
                game.enableStep();
                game.step();

                if (app.disableStepTimeout)
                {
                    window.clearTimeout(app.disableStepTimeout);
                    app.disableStepTimeout = null;
                }

                // app.disableStepTimeout = window.setTimeout(function() {game.disableStep();}, 5000);
            });

            app.testButton2.onDown.add(function() {
                game.disableStep();
            });

            app.player = new Player();
            app.player.create();

            app.rockGroupController = new RockGroupController();
            app.rockGroupController.create();

            $('body').append('<div style="position: absolute; left: ' + (game.canvas.offsetWidth+10) + 'px; top: 20px; width:200px;">' +
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
        ,

        update: function()
        {
            app.player.update();
        }
    }
});