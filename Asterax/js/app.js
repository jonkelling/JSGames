(function () {
    'use strict';

    window.app = {
		showPolygons: false,
		backgroundSpeed: 0.005,
		defaultMaxLiveBullets: 6,
		defaultFireRate: 50,
		defaultBulletLifespan: 1000,
		defaultBulletSpeed: 200,
		rockSize: {SMALL: 1, MEDIUM: 2, LARGE: 3},
		PIOver2: Math.PI/2
    };
    window.game = {};

    window.maxSpeed = 250;
    window.turnSpeed = 200;
    window.decay = 1;
    window.acceleration = 400;
    window.loadoutX = 0;

    requirejs.config({
        baseUrl: 'js',
        paths: {
            Phaser:   'lib/phaser',
            //preload:  'inc/preload',
            //create:   'inc/create',
            //update:   'inc/update',
            jq:       'lib/jquery-2.0.3.min',
            //main:     'game/main',
            phaserExtensions: 'game/phaserExtensions',
            preload:  'game/preload',
            create:   'game/create',
            update:   'game/update',
            loadout:  'game/loadout',
            destroyable: 'game/destroyable',
            AsteraxGame: 'game/asteraxGame',
            AsteraxSprite: 'game/asteraxSprite',
            AutoDestroySprite: 'game/autoDestroySprite',
            TailEmitter: 'game/tailEmitter',
            TailEmitterParticle: 'game/tailEmitterParticle',
            view:     'game/view',
            popupView: 'game/popupView',
            mainMenuView: 'game/mainMenuView',
            gameplayView: 'game/gameplayView',
            hudView:  'game/hudView',
            player:   'game/player',
            ship:     'game/ship',
            shield:   'game/shield',
            rock:     'game/rock',
            bullets:  'game/bullets',
            bullet:   'game/bullet',
            rockGroupController: 'game/rockGroupController',
            weapon:     'game/weapon',
            peaShooter: 'game/weapons/peaShooter',
            twinShot:   'game/weapons/twinShot',
            tripleShot: 'game/weapons/tripleShot',
            homingShot: 'game/weapons/homingShot',
            explodingShot: 'game/weapons/explodingShot',
            scatterBomb:   'game/weapons/scatterBomb',
            mainMenuState: 'game/states/mainMenuState',
            gameplayState: 'game/states/gameplayState',
            creditsState:  'game/states/creditsState',
            debug:    'game/debug'
        },
        shim: {
            'Phaser': {
                exports: 'Phaser'
            }
        }
    });

    require(['jq', 'Phaser', 'phaserExtensions', 'AsteraxGame', 'mainMenuState', 'gameplayState', 'creditsState', 'debug'],


    function() {

        app.debug = require('debug');
        
        jQuery.getJSON('./assets/config.json', function(data) {
            var width = data.game.width;
            var height = data.game.height;
            game = new (require('AsteraxGame'))(width, height, Phaser.AUTO, 'Asterax', { preload: function() {
                var continueLoading = function()
                {
                    game.state.add('MainMenu', require('mainMenuState'), true);
                    game.state.add('Gameplay', require('gameplayState'));
                    game.state.add('Credits', require('creditsState'));
                };
                
                //  The Google WebFont Loader will look for this object, so create it before loading the script.
                window.WebFontConfig = {
                    //  'active' means all requested fonts have finished loading
                    //  We set a 1 second delay before calling 'createText'.
                    //  For some reason if we don't the browser cannot render the text the first time it's created.
                    active: function() { game.time.events.add(Phaser.Timer.SECOND, continueLoading, this); },
                
                    //  The Google Fonts we want to load (specify as many as you like in the array)
                    google: {
                      families: ['Audiowide']
                    }
                };
                
                game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
            } });
            
        });

    });


    function render() {
        // if (app.render && app.renderContext)
        // {
        // 	app.render.call(app.renderContext);
        // }
    }


    String.prototype.padZero= function(len, c){
        var s= this, c= c || '0';
        while(s.length< len) s= c+ s;
        return s;
    };

    app.velocityFromRotation = function (rotation, speed, point)
    {
        if (typeof speed === 'undefined') { speed = 60; }
        point = point || new Phaser.Point();

        return point.setTo((Math.cos(rotation) * speed), (Math.sin(rotation) * speed));
    };

    window.setupGame = function()
    {
        game.renderer.clearBeforeRender = false;

        game.scale.setShowAll();
        game.scale.refresh();
//        game.scale.startFullScreen(true);
        game.renderer.roundPixels = true;

        app.renderForOldDevice = !game.device.webGL && game.device.iPad;

        game.antialias = !app.renderForOldDevice;
        game.renderer.clearBeforeRender = app.renderForOldDevice;
    };

    window.setupGlobalKeys = function()
    {
        app.escapeButton = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        app.nButton = game.input.keyboard.addKey(Phaser.Keyboard.N);
        app.enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        app.escapeButton.onDown.add(function() {
//            game.state.current == "MainMenu"
//                ? game.state.start("Gameplay")
//                : game.state.start("MainMenu");
            if (game.state.current == "MainMenu")
            {
                game.state.start("Gameplay", true, false);
            }
        });
    };
}());