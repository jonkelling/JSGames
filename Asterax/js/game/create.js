
define(['player', 'rock', 'rockGroupController', 'loadout', 'peaShooter'], function (Player, Rock, RockGroupController, Loadout) {
	
	return {
		run: function() {
			game.renderer.clearBeforeRender = false;
			game.renderer.roundPixels = true;
			
			game.scale.setShowAll();
			game.scale.refresh();
			game.scale.startFullScreen(true);
			
			app.renderForOldDevice = !game.device.webGL && game.device.iPad;
			
			if (!app.renderForOldDevice)
			{
				app.background = game.add.tileSprite(0, 0, game.width, game.height, 'background');
			}
			game.antialias = !app.renderForOldDevice;
			game.renderer.clearBeforeRender = app.renderForOldDevice;
			
			//	Enable p2 physics
			game.physics.startSystem(Phaser.Physics.P2JS);
			
			game.physics.p2.setImpactEvents(true);
			
			//  Make things a bit more bouncey
			game.physics.p2.defaultRestitution = 0.4;
			
			app.shipCollisionGroup = game.physics.p2.createCollisionGroup();
			app.rocksCollisionGroup = game.physics.p2.createCollisionGroup();
			app.bulletsCollisionGroup = game.physics.p2.createCollisionGroup();
			game.physics.p2.updateBoundsCollisionGroup();
			
			game.physics.p2.setBoundsToWorld(false, false, false, false, false);
			
			app.cursors = game.input.keyboard.createCursorKeys();
			app.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.C);
			app.testButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			
			app.testButton.onDown.add(function() {
				// var _w = require('peaShooter');
				// var w = new _w();
				// w.loadWeaponMods([5,1,2]);
				game.paused = !game.paused;
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
							 '</div>');
			// 
			// $('#engine1button').click(function() { acceleration = 100; });
			// $('#engine2button').click(function() { acceleration = 400; });
			// $('#engine3button').click(function() { acceleration = 800; });
		}
	}
});