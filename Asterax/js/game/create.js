
define(['player', 'rock', 'rockGroupController'], function (Player, Rock, RockGroupController) {
	return {
		run: function() {
			game.renderer.clearBeforeRender = false;
			game.renderer.roundPixels = true;
			
			//	Enable p2 physics
			game.physics.startSystem(Phaser.Physics.P2JS);
			
			//  Make things a bit more bouncey
			game.physics.p2.defaultRestitution = 0.8;
			
			app.player = new Player();
			app.player.create();
			
			app.rockGroupController = new RockGroupController();
			app.rockGroupController.create();
			
			game.physics.p2.setBoundsToWorld(false, false, false, false, false);
			
			cursors = game.input.keyboard.createCursorKeys();
			
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