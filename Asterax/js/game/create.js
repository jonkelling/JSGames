
define(['player', 'rock', 'rockGroupController'], function (Player, Rock, RockGroupController) {
	
	function fireButtonDown() {
		alert('down');
	}
	
	function fireButtonUp() {
		alert('up');
	}
	
	return {
		run: function() {
			game.renderer.clearBeforeRender = false;
			game.renderer.roundPixels = true;
			
			app.background = game.add.tileSprite(0, 0, 800, 600, 'background');
			
			//	Enable p2 physics
			game.physics.startSystem(Phaser.Physics.P2JS);
			
			game.physics.p2.setImpactEvents(true);
			
			//  Make things a bit more bouncey
			game.physics.p2.defaultRestitution = 0.8;
			
			app.shipCollisionGroup = game.physics.p2.createCollisionGroup();
			app.rocksCollisionGroup = game.physics.p2.createCollisionGroup();
			app.bulletsCollisionGroup = game.physics.p2.createCollisionGroup();
			game.physics.p2.updateBoundsCollisionGroup();
			
			game.physics.p2.setBoundsToWorld(false, false, false, false, false);

			app.cursors = game.input.keyboard.createCursorKeys();
			app.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.C);
			
			app.player = new Player();
			app.player.create();
			
			app.rockGroupController = new RockGroupController();
			app.rockGroupController.create();
			
			$('body').append('<div style="position: absolute; left: 820px; top: 20px;">' +
								'<input id="engine1button" type="button" value="engine 1"/><br/>' +
								'<input id="engine2button" type="button" value="engine 2"/><br/>' +
								'<input id="engine3button" type="button" value="engine 3"/>' +
							 '</div>');
			
			$('#engine1button').click(function() { acceleration = 100; });
			$('#engine2button').click(function() { acceleration = 400; });
			$('#engine3button').click(function() { acceleration = 800; });
		}
	}
});