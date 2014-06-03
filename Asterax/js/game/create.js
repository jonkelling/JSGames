
define(['player'], function (player) {
	return {
		run: function() {
			game.renderer.clearBeforeRender = false;
			game.renderer.roundPixels = true;
			
			game.physics.startSystem(Phaser.Physics.ARCADE);
			
			player.create();
			
			var s = new player.Ship();
			
			s.SayMyName();
			
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